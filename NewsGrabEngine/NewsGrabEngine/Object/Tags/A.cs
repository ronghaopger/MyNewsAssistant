using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsGrabEngine.Object.Tags
{
    public class A
    {
        public static List<string> FindAll(string content)
        {
            List<string> AList = new List<string>();
            int[] flag = new int[2];
            int length = content.Length;
            while (flag[1] < length)
            {
                content = content.Substring(flag[1] == 0 ? 0 : flag[1] + 1);
                flag[0] = content.IndexOf("<a");
                flag[1] = content.IndexOf("</a>");
                if (flag[0] != -1 && flag[1] != -1 && flag[1] > flag[0])
                {
                    AList.Add(content.Substring(flag[0], flag[1] + 4 - flag[0]));
                }
                else
                    break;
            }
            return AList;
        }

    }
}
