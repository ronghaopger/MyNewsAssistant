using Model;
using NewsGrabEngine;
using NewsGrabEngine.Object;
using NewsGrabEngine.Object.Tags;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace NewsGrabWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Hot()
        {
            ViewData.Model = DataManage.GetHotNews();
            return View();
        }

        public ActionResult Search()
        {
            return View();
        }

        public ActionResult InTime()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
