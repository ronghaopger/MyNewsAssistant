using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class websiteModel
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string Charset { get; set; }
        private Dictionary<string, forumModel> _forumDic = new Dictionary<string, forumModel>();
        public Dictionary<string, forumModel> ForumDic
        {
            get {
                return _forumDic;
            }
            set {
                _forumDic = value;
            }
        }
    }
}
