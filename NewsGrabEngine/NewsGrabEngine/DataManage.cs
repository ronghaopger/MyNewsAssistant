using Model;
using NewsGrabEngine.Object;
using NewsGrabEngine.Object.Tags;
using RHClassLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NewsGrabEngine
{
    public class DataManage
    {
        public static List<AModel> GetHotNews()
        {
            List<AModel> allHot = new List<AModel>();
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(System.AppDomain.CurrentDomain.BaseDirectory + @"\Config\websiteConfig.xml");
            XmlNode root = xmlDoc.SelectSingleNode("websites");
            foreach (XmlNode node in root.ChildNodes)
            {
                websiteModel model = new websiteModel();
                model.Name = node.Attributes[0].Value;
                model.Url = node.Attributes[1].Value;
                model.Charset = node.Attributes[2].Value;
                XmlNode foumRoot = node.SelectSingleNode("forums");
                foreach (XmlNode forumNode in foumRoot.ChildNodes)
                {
                    forumModel forummodel = new forumModel();
                    forummodel.Name = forumNode.Attributes[0].Value;
                    forummodel.BeginFlag = forumNode.Attributes[1].Value;
                    forummodel.EndFlag = forumNode.Attributes[2].Value;
                    model.ForumDic.Add(forummodel.Name, forummodel);
                }
                Website website = new Website(model.Url);
                string forumContent = Forum.GetForum(website.GetWebContent(model.Charset) , model.ForumDic["头条"]);
                allHot.AddRange(A.FindAll(forumContent, model.Name));
            }
            return allHot;
        }
    }
}
