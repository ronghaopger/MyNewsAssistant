using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsGrabEngine.Object.Tags
{
    public class A
    {
        public static List<AModel> FindAll(string content)
        {
            List<AModel> AList = new List<AModel>();
            int[] flag = new int[2];
            int length = content.Length;
            while (flag[1] < length)
            {
                content = content.Substring(flag[1] == 0 ? 0 : flag[1] + 1);
                flag[0] = content.IndexOf("<a");
                flag[1] = content.IndexOf("</a>");
                if (flag[0] != -1 && flag[1] != -1 && flag[1] > flag[0])
                {
                    string astring = content.Substring(flag[0], flag[1] + 4 - flag[0]);
                    AModel amodel = new AModel();
                    amodel.Url = GetTagAttribute(astring, "href");
                    amodel.Title = GetTagContent(astring);
                    if (amodel.Url != string.Empty && amodel.Title != string.Empty)
                    {
                        AList.Add(amodel);
                    }
                }
                else
                    break;
            }
            return AList;
        }

        public static string GetTagAttribute(String content, string attr)
        {
            int piIndex = content.IndexOf(attr);
            //若用户设置了指定属性，就去一步步读取指定属性的值。
            if (piIndex != -1)
            {
                content = content.Substring(piIndex + attr.Length + 1);
                content = content.Substring(content.IndexOf("\"") + 1);
                content = content.Substring(0, content.IndexOf("\""));
                return content;
            }
            return string.Empty;
        }
        public static string GetTagContent(String content)
        {
            int piIndex = content.IndexOf(">");
            int diIndex = content.IndexOf("</a>");
            if (piIndex != -1 && diIndex != -1)
            {
                content = content.Substring(piIndex + 1, diIndex - piIndex - 1);
                return content;
            }
            return string.Empty;
        }
    }
}
