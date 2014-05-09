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
    }
}
