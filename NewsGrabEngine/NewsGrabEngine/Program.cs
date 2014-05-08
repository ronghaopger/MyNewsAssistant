using NewsGrabEngine.Object;
using NewsGrabEngine.Object.Tags;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace NewsGrabEngine
{
    class Program
    {
        static void Main(string[] args)
        {
            //MyXmlHelper Xmlhelper = new MyXmlHelper(System.AppDomain.CurrentDomain.BaseDirectory + @"Config\website.xml");
            Website website = new Website("http://soccer.hupu.com/");
            List<string> aList = A.FindAll(website.GetWebContent());
            Console.ReadKey();
        }
    }
}
