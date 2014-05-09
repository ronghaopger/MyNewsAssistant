using Model;
using NewsGrabEngine.Object.Tags;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace NewsGrabEngine.Object
{
    public class Website
    {
        private websiteModel model = new websiteModel();
        public Website(string url)
        {
            model.Url = url;
        }
        public string GetWebContent()
        {
            WebRequest request = WebRequest.Create(model.Url);
            WebResponse response = request.GetResponse();
            System.IO.Stream stream = response.GetResponseStream();
            System.IO.StreamReader reader = new System.IO.StreamReader(stream, Encoding.GetEncoding("utf-8"));
            string content = reader.ReadToEnd();
            return content;
        }
    }
}
