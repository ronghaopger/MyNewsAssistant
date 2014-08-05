using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsGrabEngine.Object
{
    public class Forum
    {
        public static string GetForum(string content,forumModel model)
        {
            int beginflag = content.IndexOf(model.BeginFlag);
            int endflag = content.IndexOf(model.EndFlag);
            if (beginflag != -1 && endflag != -1)
            {
                return content.Substring(beginflag, endflag - beginflag);
            }
            return string.Empty;
        }
        public static string GetForum(string content, string beginFlag, string endFlag)
        {
            int beginflag = content.IndexOf(beginFlag);
            int endflag = content.IndexOf(endFlag);
            if (beginflag != -1 && endflag != -1)
            {
                return content.Substring(beginflag + beginFlag.Length, endflag - beginflag);
            }
            return string.Empty;
        }
    }
}
