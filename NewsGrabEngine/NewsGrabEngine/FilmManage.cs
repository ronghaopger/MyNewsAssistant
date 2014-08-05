using System;
using System.Collections.Generic;
using System.Linq;
using Model;
using NewsGrabEngine.Object;
using NewsGrabEngine.Object.Tags;
using RHClassLibrary;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace NewsGrabEngine
{
    public class FilmManage
    {
        private static XDocument document;
        private static string projectPath = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
        static FilmManage()
        {
            using (FileStream file = File.Create(projectPath + @"/Data/DataSource.xml"))
            { }
            using (StreamWriter rootWriter = File.AppendText(projectPath + @"/Data/DataSource.xml"))
            {
                rootWriter.Write("<Root></Root>");
            }
            document = XDocument.Load(projectPath + @"/Data/DataSource.xml");
        }
        public static void GetFilm()
        {
            InitializeFilm();
            InitializeData();
            InitializeFilmCenter();
            InitializeFilmInfo();
            document.Save(projectPath + @"/Data/DataSource.xml");
        }

        #region 初始化电影标题
        public static void InitializeFilm()
        {
            GetFilmTitle();
        }

        private static void GetFilmTitle()
        {
            string Title_Flag = "data-title";
            string Score_Flag = "data-score";
            string Release_Flag = "data-release";
            string Duration_Flag = "data-duration";
            string Director_Flag = "data-director";
            string Actors_Flag = "data-actors";

            Website website = new Website("http://movie.douban.com/nowplaying/beijing/");
            string forumContent = Forum.GetForum(website.GetWebContent("utf-8"), "正在上映", "即将上映");
            int recordFlag = 0;//偶数是标题，奇数是重复。另：用于记录抓取的电影数。
            while (forumContent.Contains(Title_Flag))
            {
                if (recordFlag % 2 == 0)
                {
                    XElement filmElement = new XElement("Film");
                    filmElement.Add(InitializeFilmXAttribute(ref forumContent, Title_Flag, "Title"));
                    filmElement.Add(InitializeFilmXAttribute(ref forumContent, Score_Flag, "Score"));
                    filmElement.Add(InitializeFilmXAttribute(ref forumContent, Release_Flag, "Release"));
                    filmElement.Add(InitializeFilmXAttribute(ref forumContent, Duration_Flag, "Duration"));
                    filmElement.Add(InitializeFilmXAttribute(ref forumContent, Director_Flag, "Director"));
                    filmElement.Add(InitializeFilmXAttribute(ref forumContent, Actors_Flag, "Actors"));
                    document.Root.Add(filmElement);
                }
                else
                {
                    forumContent = forumContent.Substring(forumContent.IndexOf(Title_Flag) + Title_Flag.Length + 2);
                }
                recordFlag++;
                if (recordFlag >= 20)
                    break;
            }
        }
        public static XAttribute InitializeFilmXAttribute(ref string forumContent, string flag, string attrName)
        {
            XAttribute value = new XAttribute(attrName, GetAttr(ref forumContent, flag));
            return value;
        }
        private static string GetAttr(ref string forumContent, string flag)
        {
            int Index = forumContent.IndexOf(flag) + flag.Length + 2;
            forumContent = forumContent.Substring(Index);
            int EndIndex = forumContent.IndexOf("\"");
            return forumContent.Substring(0, EndIndex);
        }
        #endregion

        #region 初始化日期
        public static void InitializeData()
        {
            for (int i = 0; i < 2; i++)
            {
                XElement dateElement = new XElement("Date");
                XAttribute value = new XAttribute("Value", FormatDate(DateTime.Now.AddDays(i)));
                dateElement.Add(value);
                foreach (var eleFilm in document.Root.Elements("Film"))
                {
                    eleFilm.Add(dateElement);
                }
            }
        }

        public static string FormatDate(DateTime dt)
        {
            return dt.Year.ToString()
                + (dt.Month.ToString().Length == 1 ? "0" + dt.Month : dt.Month.ToString())
                + (dt.Day.ToString().Length == 1 ? "0" + dt.Day : dt.Day.ToString());
        }
        #endregion

        #region 初始化电影院
        public static void InitializeFilmCenter()
        {
            XDocument documentFilmCenter = XDocument.Load(projectPath + @"/Data/FilmCentersCopy.xml");
            foreach (var eleFilm in document.Root.Elements("Film"))
            {
                foreach (var eleDate in eleFilm.Elements("Date"))
                {
                    eleDate.Add(documentFilmCenter.Root.Elements("FilmCenter"));
                }
            }
        }
        #endregion

        #region 初始化电影排片信息
        public static void InitializeFilmInfo()
        {
            //初始化影院信息
            XDocument documentFilmCenter = XDocument.Load(projectPath + @"/Data/FilmCenters.xml");
            List<FilmCenter> centerList = new List<FilmCenter>();
            foreach (var filmCenter in documentFilmCenter.Root.Elements("FilmCenter"))
            {
                FilmCenter center = new FilmCenter();
                center.Code = filmCenter.Attribute("Code").Value;
                center.Url = filmCenter.Attribute("Url").Value;
                centerList.Add(center);
            }
            GetFilmInfo(centerList);
        }
        public static void GetFilmInfo(List<FilmCenter> centerList)
        {
            foreach (var center in centerList)
            {
                foreach (var dateEle in document.Root.Element("Film").Elements("Date"))
                {
                    Website website = new Website(center.Url + "?d=" + dateEle.Attribute("Value").Value + "#");
                    string forumContent = Forum.GetForum(website.GetWebContent("utf-8"), "按影片", "·Mtime(时光网)声明：");
                    foreach (var filmEle in document.Root.Elements("Film"))
                    {
                        string forumContentCopy = forumContent;
                        if (forumContentCopy.Contains(filmEle.Attribute("Title").Value))
                        {
                            forumContentCopy = forumContentCopy.Substring(forumContentCopy.IndexOf(filmEle.Attribute("Title").Value));
                            if (forumContentCopy.Contains("mdShowtime"))
                            {
                                forumContentCopy = forumContentCopy.Substring(0, forumContentCopy.IndexOf("mdShowtime"));
                            }
                            int upFlag = -1;
                            while (forumContentCopy.Contains("ticketnone"))
                            {
                                //如果forumContentCopy中的内容没有变，则会死循环。所以要判断。
                                if (forumContentCopy.IndexOf("ticketnone") == upFlag)
                                    break;
                                upFlag = forumContentCopy.IndexOf("ticketnone");
                                XElement infoEle = GetDetailInfo(ref forumContentCopy);
                                XElement filmcenterElee = LookForEle(filmEle, dateEle.Attribute("Value").Value, center.Code);
                                filmcenterElee.Add(infoEle);
                            }
                            upFlag = -1;
                            while (forumContentCopy.Contains("ticketing"))
                            {
                                //如果forumContentCopy中的内容没有变，则会死循环。所以要判断。
                                if (forumContentCopy.IndexOf("ticketing") == upFlag)
                                    break;
                                upFlag = forumContentCopy.IndexOf("ticketing");
                                XElement infoEle = GetDetailInfo(ref forumContentCopy);
                                XElement filmcenterElee = LookForEle(filmEle, dateEle.Attribute("Value").Value, center.Code);
                                filmcenterElee.Add(infoEle);
                            }
                        }
                    }
                }
            }
        }
        private static XElement GetDetailInfo(ref string forumContentCopy)
        {
            string time, price, hall;
            if (forumContentCopy.Contains("<em>&yen;"))
            {
                forumContentCopy = forumContentCopy.Substring(forumContentCopy.IndexOf("<em>&yen;"));
                price = forumContentCopy.Substring("<em>&yen;".Length, forumContentCopy.IndexOf("</em>") - "<em>&yen;".Length);
            }
            else
                price = string.Empty;
            if (forumContentCopy.Contains("<b><strong>"))
            {
                forumContentCopy = forumContentCopy.Substring(forumContentCopy.IndexOf("<b><strong>"));
                time = forumContentCopy.Substring("<b><strong>".Length, forumContentCopy.IndexOf("</strong></b>") - "<b><strong>".Length);
            }
            else
                time = string.Empty;
            if (forumContentCopy.Contains("class=\"hall\">"))
            {
                forumContentCopy = forumContentCopy.Substring(forumContentCopy.IndexOf("class=\"hall\">"));
                hall = forumContentCopy.Substring("class=\"hall\">".Length, forumContentCopy.IndexOf("</span></a>") - "class=\"hall\">".Length);
            }
            else
                hall = string.Empty;
            XElement infoElement = new XElement("Info");
            XAttribute timeAttr = new XAttribute("StartTime", time);
            infoElement.Add(timeAttr);
            XAttribute priceAttr = new XAttribute("Price", price);
            infoElement.Add(priceAttr);
            XAttribute hallAttr = new XAttribute("Hall", hall);
            infoElement.Add(hallAttr);
            return infoElement;
        }
        private static XElement LookForEle(XElement filmEle, string date, string code)
        {
            foreach (var dateElee in filmEle.Elements("Date"))
            {
                if (dateElee.Attribute("Value").Value == date)
                {
                    foreach (var filmcenterElee in dateElee.Elements("FilmCenter"))
                    {
                        if (filmcenterElee.Attribute("Code").Value == code)
                        {
                            return filmcenterElee;
                        }
                    }
                }
            }
            return null;
        }
        #endregion
    }
}
