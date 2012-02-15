//coded by http://wecode.in
//  GADGET >> URL Declarations
var URL = new Object;
URL.Site = "http://www.thewindowsclub.com/";
URL.Feed = "http://feeds2.feedburner.com/TheWindowsClub";

var URL2 = new Object;
URL2.Site = "http://www.windowsteamblog.com";
URL2.Feed = "http://windowsteamblog.com/blogs/MainFeed.aspx";


//*************************************************************
//  GADGET >> Timers
//*************************************************************
var Timer_Interval = '';
var Timer_Auto_Scroll = '';

//>>	Gadget: General Functions
var noOfFeeds=0;
var xString3='';
//*************************************************************
//  GADGET >> GEN: Initialize 
//*************************************************************
function GADGET_GEN_Init()
{	
	//>> Load Data From File
	UTIL_STOR_Load();
	
	//>>  Construct UI
	var xString = '';
	
	//>> Top Logo
	xString += '<div id="Logo-Top" title="The Windows Club"></div>';
	
	//>> Feed Area
	xString += '<div id="Sec-Feed"></div>';
	
	//>> Control Area
	xString += '<div id="Sec-Control">';
		xString += '<div id="Button-Left"></div>';
		xString += '<div id="Control-Center"></div>';
		xString += '<div id="Button-Right"></div>';
	xString += '</div>';
	
	System.Gadget.document.getElementById("Gadget-Content").innerHTML = xString;
	
	GADGET_GEN_Check_Dock();
	
	GADGET_RSS_Feed_Start();
}

//*************************************************************
//  GADGET >> GEN: Check Dock
//*************************************************************
function GADGET_GEN_Check_Dock()
{	
	
	
	var Size_Dock = "Small";
		
	var	Size_UnDock = "Small";
	
	if (System.Gadget.docked)
	{
		if (Size_Dock == "Small")
			GADGET_GEN_OnDock();
		else if (Size_Dock == "Large")
			GADGET_GEN_OnUnDock();	
	}
	else
	{
		if (Size_UnDock == "Large")
			GADGET_GEN_OnUnDock();
		else if (Size_UnDock == "Small")
			GADGET_GEN_OnDock();
	}
}

//*************************************************************
//  GADGET >> GEN: On Dock (UI Reconstruction)
//*************************************************************
function GADGET_GEN_OnDock()
{	
	
	var	Theme = "1";
	var	Entry_Disp = "5";
	
	//>> Interface Resize
	System.Gadget.document.body.style.width = "130px";
	System.Gadget.document.body.style.height = "228px"; //245

	System.Gadget.document.body.style.background = "url('Images/Themes/BG-Gadget-" + Theme + "-" + Entry_Disp + "-Small.png') no-repeat";

	//>> Section: Feed
	System.Gadget.document.getElementById("Sec-Feed").className = "SM-Sec-Feed-" + Entry_Disp;
	
	//>> Section: Control
	System.Gadget.document.getElementById("Sec-Control").className = "SM-Sec-Control";
	System.Gadget.document.getElementById("Button-Left").className = "SM-Button-Left-Dark";
	System.Gadget.document.getElementById("Control-Center").className = "SM-BG-Control-Dark";
	System.Gadget.document.getElementById("Button-Right").className = "SM-Button-Right-Dark";
	
	//>> Top Logo
	System.Gadget.document.getElementById("Logo-Top").className = "SM-Logo-Top";
	
	//>> Set Size Variable
	System.Gadget.Settings.write("Size", "SM");
	
	//>> Check For Existing Feed	
	if (System.Gadget.Settings.read("Page") && System.Gadget.document.getElementById("Sec-Feed").innerHTML != '')
		GADGET_RSS_Feed_Disp(System.Gadget.Settings.read("Page"));
}


//*************************************************************
//  GADGET >> GEN: Gadget Logo Launch
//*************************************************************
function GADGET_GEN_Launch()
{	
	System.Gadget.Settings.write("URL", URL.Site);
	Shell.Run(URL.Site);
}

//>>	Gadget: RSS Functions

//RSS: Feed Start

function GADGET_RSS_Feed_Start()
{
	//>> Begin Feed Check Loading
	xString = '<br /><br /><img src="../Images/BG/BG-Loading.gif" /><br /><br /><strong>LOADING</strong>';
	System.Gadget.document.getElementById("Sec-Feed").innerHTML = xString;
	
	//>> Send Data
	try
	{
		Feed_Http = UTIL_AJAX_Create(GADGET_RSS_Feed_End);
		Feed_Http.open("GET", URL.Feed, true);
		Feed_Http.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		Feed_Http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		Feed_Http.send();
	}
	catch(err){}
}

//  GADGET >> RSS: Feed End

function GADGET_RSS_Feed_End()
{
	if (Feed_Http.readyState == null)
	return;
	
	if (Feed_Http.readyState == 4) 
	{	
		if (Feed_Http.status == 200 && Feed_Http.responseText != '') 
		{			
			//>> Load Feed
			var Feed = Feed_Http.responseXML;
			UTIL_XML_Load(Feed);
			
			//>> Parse Feed Into Containers
			var i = 0;
			var xString1 = '';
			
			var xFile = XML_Doc.getElementsByTagName("rss")[0];
			var xFile_Item = xFile.getElementsByTagName("item");
			
			xString1 += '<div id="Entry_Count">' + xFile_Item.length + '</div>';
			
			while (i < xFile_Item.length)
			{
				var xFile_Post = xFile_Item[i];
				
				xString1 += '<div id="Entry_' + i + '">';
				xString1 += '<div id="Entry_' + i + '_Title">' + xFile_Post.getElementsByTagName("title")[0].text + '</div>';
				xString1 += '<div id="Entry_' + i + '_Description">' + xFile_Post.getElementsByTagName("description")[0].text + '</div>';
				xString1 += '<div id="Entry_' + i + '_Link">' + xFile_Post.getElementsByTagName("link")[0].text + '</div>';
				xString1 += '<div id="Entry_' + i + '_Date">' + xFile_Post.getElementsByTagName("pubDate")[0].text + '</div>';
				xString1 += '</div>';				
				i++;
			}
			noOfFeeds=i;
			xString3 = xString1;
			//System.Gadget.document.getElementById("Gadget-Feed").innerHTML = xString1;
	
			secondFeed();
			
		}			
		else
		{
			var xString = '<br /><img src="../Images/BG/BG-Fail.png" /><br /><strong>Connection Error</strong>';
			xString += '<br /><div id="Button-Retry" title="Retry?" onclick="GADGET_RSS_Retry();"></div>';
			System.Gadget.document.getElementById("Sec-Feed").innerHTML = xString;
		}
	}
}
//Start Second Feed Functions
function secondFeed()
{

	//>> Send Data
	try
	{
		Feed_Http2 = UTIL_AJAX_Create(GADGET_RSS_Feed_End2);
		Feed_Http2.open("GET", URL2.Feed, true);
		Feed_Http2.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		Feed_Http2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		Feed_Http2.send();
	}
	catch(err){}
}

function GADGET_RSS_Feed_End2()
{
	if (Feed_Http2.readyState == null)
	return;
	
	if (Feed_Http2.readyState == 4) 
	{	
		if (Feed_Http2.status == 200 && Feed_Http2.responseText != '') 
		{			
			//>> Load Feed
			var Feed = Feed_Http2.responseXML;
			UTIL_XML_Load(Feed);
			
			//>> Parse Feed Into Containers
			var j = 0;
						
			var xFile = XML_Doc.getElementsByTagName("rss")[0];
			var xFile_Item = xFile.getElementsByTagName("item");
			
			var xString2='';
			var limit=10;
			if (xFile_Item.length < 10)
			 limit=xFile_Item.length;
			
			while (j < limit)
			{
				var xFile_Post = xFile_Item[j];
				var temp=noOfFeeds + j;
				
				xString2 += '<div id="Entry_' + temp + '">';
				xString2 += '<div id="Entry_' + temp + '_Title">' + xFile_Post.getElementsByTagName("title")[0].text + '</div>';
				xString2 += '<div id="Entry_' + temp + '_Description">' + xFile_Post.getElementsByTagName("description")[0].text + '</div>';
				xString2 += '<div id="Entry_' + temp + '_Link">' + xFile_Post.getElementsByTagName("link")[0].text + '</div>';
				xString2 += '<div id="Entry_' + temp + '_Date">' + xFile_Post.getElementsByTagName("pubDate")[0].text + '</div>';
				xString2 += '</div>';
				
				j++;
			}
			noOfFeeds += j;
			xString3 += xString2;
	
			System.Gadget.document.getElementById("Gadget-Feed").innerHTML = xString3;
			//>> Set Update Interval
			var Interval = 60;
				
			if (Interval != '' && Interval != "Off")
			{
				Interval = Interval * 60000;
				Timer_Interval = setTimeout(GADGET_RSS_Feed_Start, Interval);
			}
			
			GADGET_RSS_Feed_Disp(1);
		}			
		else
		{
			var xString = '<br /><img src="../Images/BG/BG-Fail.png" /><br /><strong>Connection Error</strong>';
			xString += '<br /><div id="Button-Retry" title="Retry?" onclick="GADGET_RSS_Retry();"></div>';
			System.Gadget.document.getElementById("Sec-Feed").innerHTML = xString;
		}
	}
}

//End Second Feed Functions
//  GADGET >> RSS: Retry Getting Feed

function GADGET_RSS_Retry()
{	
	var xString = '<br /><br /><img src="../Images/BG/BG-Loading.gif" /><br /><br /><strong>LOADING</strong>';
	System.Gadget.document.getElementById("Sec-Feed").innerHTML = xString;
	
	GADGET_RSS_Feed_Start();
}

//  GADGET >> RSS: Feed Display

function GADGET_RSS_Feed_Disp(Page)
{	
	//>> Clear Auto-Scroll Timer
	if (Timer_Auto_Scroll)
		clearTimeout(Timer_Auto_Scroll);
	
	//>> Get Variables		
	var	Auto_Scroll = 20;		
	var	Entry_Disp = "5";		
	var Size = System.Gadget.Settings.read("Size");
	
	//var Entry_Count = parseInt(System.Gadget.document.getElementById("Entry_Count").innerHTML);
	var Entry_Count = noOfFeeds;
	var Page_Count = Math.ceil(Entry_Count / Entry_Disp);
	
	if (Page > Page_Count)
		Page = 1;
		
	var i = (Page * Entry_Disp) - Entry_Disp;
	var Limit = Page * Entry_Disp;
	if (Limit > Entry_Count)
		Limit = Entry_Count;
	var xString = '';
	var Display = (i+1) + " - " + Limit;
	
	//>> Call Information & Build Display
	while (i < Limit)
	{
		var Entry_Title = System.Gadget.document.getElementById("Entry_" + i + "_Title").innerHTML;
		var Entry_Title_Full = Entry_Title
		if (Size == "SM")
		{
			if (Entry_Title.length > 22)
				Entry_Title = Entry_Title.substr(0, 19) + "...";
		}
		else
		{
			if (Entry_Title.length > 44)
				Entry_Title = Entry_Title.substr(0, 41) + "...";
		}
		
		var Entry_Date = System.Gadget.document.getElementById("Entry_" + i + "_Date").innerHTML;
		Entry_Date = Entry_Date.split(":");
		Entry_Date = Entry_Date[0];
		Entry_Date = Entry_Date.substr(4, (Entry_Date.length - 7));
		
		xString += '<div class="' + Size + '-Feed-Entry" id="Feed_Entry_' + i + '" onclick="GADGET_RSS_Entry_Open(' + i + ');">';
		xString += '<div class="' + Size + '-Feed-Entry-Title" title="' + Entry_Title_Full + '">' + Entry_Title + '</div>';
		xString += '<div class="' + Size + '-Feed-Entry-Date">' + Entry_Date + '</div>';
		xString += '<div class="' + Size + '-Feed-Entry-Close" id="Feed_Entry_' + i + '_Close" onclick="GADGET_GEN_Flyout_Close();" title="Close Flyout">X</div>';
		xString += '</div>';
		
		i++;
	}
	
	System.Gadget.document.getElementById("Sec-Feed").innerHTML = xString;
	
	//>> Set Controls
	var Page_Prev = Page - 1;
	if (Page_Prev == 0)
		Page_Prev = Page_Count;
	
	var Page_Next = Page + 1;
	if (Page_Next > Page_Count)
		Page_Next = 1;	
	
	xString = '';
	
	xString += '<div id="Button-Left" class="' + Size + '-Button-Left" title="Previous" onclick="GADGET_RSS_Feed_Disp(' + Page_Prev + ');"></div>';
	xString += '<div id="Control-Center" class="' + Size + '-BG-Control">' + Display + '</div>';
	xString += '<div id="Button-Right" class="' + Size + '-Button-Right" title="Next" onclick="GADGET_RSS_Feed_Disp(' + Page_Next + ');"></div>';
	
	System.Gadget.document.getElementById("Sec-Control").innerHTML = xString;
	
	//>> Set Auto-Scroll
	System.Gadget.Settings.write("Page", Page);
	
	if (Auto_Scroll != '' && Auto_Scroll != "Off")
	{
		Auto_Scroll = Auto_Scroll * 1000;
		Timer_Auto_Scroll = setTimeout(GADGET_RSS_Auto_Scroll, Auto_Scroll);
	}
}

//  GADGET >> RSS: Auto-Scroll Feed
function GADGET_RSS_Auto_Scroll()
{	
	var Page = System.Gadget.Settings.read("Page");
	GADGET_RSS_Feed_Disp(Page+1);
}


//  GADGET >> RSS: Open Feed Entry
function GADGET_RSS_Entry_Open(Entry)
{	
	//>> Clear Timers
	if (Timer_Interval)
		clearTimeout(Timer_Interval);
	
	if (Timer_Auto_Scroll)
		clearTimeout(Timer_Auto_Scroll);

	//>> Get Variables
		
	var	Display = "Browser";
	var	Entry_Disp = "5";
		
	var Size = System.Gadget.Settings.read("Size");
	
	System.Gadget.Settings.write("Entry_Open", Entry);
	
	//>> Reset Current Entry Styles
	//var Entry_Count = parseInt(System.Gadget.document.getElementById("Entry_Count").innerHTML);
	var Entry_Count = parseInt(noOfFeeds);
	var Page = System.Gadget.Settings.read("Page");
	
	var i = (Page * Entry_Disp) - Entry_Disp;
	var Limit = Page * Entry_Disp;
	if (Limit > Entry_Count)
		Limit = Entry_Count;
		
	while (i < Limit)
	{
		System.Gadget.document.getElementById("Feed_Entry_" + i).className = Size + "-Feed-Entry";
		System.Gadget.document.getElementById("Feed_Entry_" + i + "_Close").style.display = "none";
		i++;
	}
	

		var xURL = System.Gadget.document.getElementById("Entry_" + Entry + "_Link").innerHTML;
		
		var	Interval = 60;
			
		if (Interval != '' && Interval != "Off")
		{
			Interval = Interval * 60000;
			Timer_Interval = setTimeout(GADGET_RSS_Feed_Start, Interval);
		}
		
		var Auto_Scroll = System.Gadget.Settings.read("Auto_Scroll");
		if (Auto_Scroll == '')
			Auto_Scroll = 20;
		
		if (Auto_Scroll != '' && Auto_Scroll != "Off")
		{
			Auto_Scroll = Auto_Scroll * 1000;
			Timer_Auto_Scroll = setTimeout(GADGET_RSS_Auto_Scroll, Auto_Scroll);
		}
		
		Shell.Run(xURL);		
	//}
}


//  GADGET >> RSS: Close Feed Entry & Re-Do Timers
function GADGET_RSS_Entry_Close()
{
	//>> Reset Feed Entry Style
	var Entry_Open = System.Gadget.Settings.read("Entry_Open");
	var Size = System.Gadget.Settings.read("Size");
	
	System.Gadget.document.getElementById("Feed_Entry_" + Entry_Open).className = Size + "-Feed-Entry";
	System.Gadget.document.getElementById("Feed_Entry_" + Entry_Open + "_Close").style.display = "none";
	
	//>> Re-Establish Timers
	var Interval = 60;
		
	if (Interval != '' && Interval != "Off")
	{
		Interval = Interval * 60000;
		Timer_Interval = setTimeout(GADGET_RSS_Feed_Start, Interval);
	}
	
	var Auto_Scroll = System.Gadget.Settings.read("Auto_Scroll");
	if (Auto_Scroll == '')
		Auto_Scroll = 20;
	
	if (Auto_Scroll != '' && Auto_Scroll != "Off")
	{
		Auto_Scroll = Auto_Scroll * 1000;
		Timer_Auto_Scroll = setTimeout(GADGET_RSS_Auto_Scroll, Auto_Scroll);
	}
}