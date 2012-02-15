//coded by http://wecode.in
//Global Variables

var STOR_File = "../Storage.xml";
var Shell = new ActiveXObject("WScript.Shell");
var FSO = new ActiveXObject("Scripting.FileSystemObject");
var XML_Doc = new ActiveXObject("Microsoft.XMLDOM");
var XML_Obj = '';


//Load File

function UTIL_XML_Load(XML_File) 
{ 
	try
	{
		XML_Doc.async="false"; 
		XML_Doc.onreadystatechange = UTIL_XML_Verify; 
		XML_Doc.load(XML_File);
		XML_Obj = XML_Doc.documentElement;
	}
	catch(err){}
}


//Verify File
function UTIL_XML_Verify() 
{ 
 	if (XML_Doc.readyState != 4) 
		return false; 
}


//AJAX: Create GET/POST Ajax Element

function UTIL_AJAX_Create(Handler)
{ 
	try
	{
		var AJAX_Obj = null;
		AJAX_Obj = new XMLHttpRequest();
		AJAX_Obj.onreadystatechange = Handler;
		return AJAX_Obj;
	}
	catch(err){}
}


//STR: Cut String Down Certain Size
function UTIL_STR_Cut(Str, Length)
{
	if (Str.length > Length) 
		return(Str.substring(0, (Length - 3)) + "...");
	else 
		return(Str);
}


//Save To File
function UTIL_STOR_Save()
{
	try
	{
		//>> Load Control XML File
		UTIL_XML_Load(STOR_File);
		var xFile = XML_Doc.getElementsByTagName("Storage")[0];
		
		//>> Parse Location
		var xFile_Location = xFile.getElementsByTagName("Location")[0];
		var Path = xFile_Location.getElementsByTagName("Path")[0].text;
		var File = xFile_Location.getElementsByTagName("File")[0].text;
		
		//>> Verify Path
		var sPath = UTIL_STOR_Check_Path(Path);
		var sFile = sPath + "\\" + File;
		
		if (FSO.FileExists(sFile))
			FSO.DeleteFile(sFile, true);
		var oFile = FSO.CreateTextFile(sFile, true);
		
		//>> Parse / Add Values
		var xString = '<?xml version="1.0" encoding="ISO-8859-1" ?>';
		xString += '<Settings>';
		
		var xFile_Data = xFile.getElementsByTagName("Data")[0];
		var xFile_Value = xFile_Data.getElementsByTagName("Value");
		
		i = 0;
		var Temp = '';
		var Temp_Name = '';
		var Temp_Default = '';
		var Temp_Value = '';
		
		while (i < xFile_Value.length)
		{
			Temp = xFile_Value[i];
			Temp_Name = Temp.getAttribute("Name");
			Temp_Default = Temp.getAttribute("Default");
			Temp_Value = System.Gadget.Settings.read(Temp_Name);
			if (Temp_Value == '')
				Temp_Value = Temp_Default;
				
			xString += "<" + Temp_Name + ">" + Temp_Value + "</" + Temp_Name + ">";
			i++;		
		}
		
		xString += '</Settings>';
		
		//>> Save File, Close
		oFile.WriteLine(xString);
		oFile.Close();
	}
	catch(err)
	{
		var X = "File (Save) I/O Error: " + err;
		UTIL_STOR_Debug(X);
	}
}


//Load From File

function UTIL_STOR_Load()
{
	try
	{
		//>> Load Control XML File
		UTIL_XML_Load(STOR_File);
		var xFile = XML_Doc.getElementsByTagName("Storage")[0];
		
		//>> Parse Location
		var xFile_Location = xFile.getElementsByTagName("Location")[0];
		var Path = xFile_Location.getElementsByTagName("Path")[0].text;
		var File = xFile_Location.getElementsByTagName("File")[0].text;
		
		//>> Verify Path
		var sPath = UTIL_STOR_Check_Path(Path);		
		var sFile = sPath + "\\" + File;
	
		//>> Test For File
		if (FSO.FileExists(sFile))
		{			
			//>> Parse / Retrieve Values
			var xFile_Data = xFile.getElementsByTagName("Data")[0];
			var xFile_Value = xFile_Data.getElementsByTagName("Value");
			
			i = 0;
			var Temp = '';
			var Temp_Name = new Array();
			var Temp_Default = new Array();
			
			while (i < xFile_Value.length)
			{
				Temp = xFile_Value[i];
				Temp_Name[i] = Temp.getAttribute("Name");
				Temp_Default[i] = Temp.getAttribute("Default");
				i++;		
			}
			
			UTIL_XML_Load(sFile);
			xFile = XML_Doc.getElementsByTagName("Settings")[0];
			
			i = 0;
			while (i < Temp_Name.length)
			{
				try{ System.Gadget.Settings.write(Temp_Name[i], xFile.getElementsByTagName(Temp_Name[i])[0].text); }
				catch(err){ System.Gadget.Settings.write(Temp_Name[i], Temp_Default[i]); }
				i++;
			}
		}
		else
			UTIL_STOR_Save();
	}
	catch(err)
	{
		var X = "File (Load) I/O Error: " + err;
		UTIL_STOR_Debug(X);
	}		
}

// Load Defaults
function UTIL_STOR_Load_Default()
{
	try
	{
		//>> Load Control XML File
		UTIL_XML_Load(STOR_File);
		var xFile = XML_Doc.getElementsByTagName("Storage")[0];
		
		//>> Parse / Retrieve Values
		var xFile_Data = xFile.getElementsByTagName("Data")[0];
		var xFile_Value = xFile_Data.getElementsByTagName("Value");
			
		i = 0;
		var Temp = '';
		var Temp_Name = '';
		var Temp_Default = '';
		
		while (i < xFile_Value.length)
		{
			Temp = xFile_Value[i];
			Temp_Name = Temp.getAttribute("Name");
			Temp_Default = Temp.getAttribute("Default");
			System.Gadget.Settings.write(Temp_Name, Temp_Default);
			i++;		
		}
	}
	catch(err)
	{
		var X = "File (Load Default) I/O Error: " + err;
		UTIL_STOR_Debug(X);
	}		
}

//Debug Values

function UTIL_STOR_Debug(Data)
{
	try
	{
		//>> Load Control XML File
		UTIL_XML_Load(STOR_File);
		var xFile = XML_Doc.getElementsByTagName("Storage")[0];
		
		//>> Parse Location
		var xFile_Location = xFile.getElementsByTagName("Location")[0];
		var Path = xFile_Location.getElementsByTagName("Path")[0].text;
		var File = xFile_Location.getElementsByTagName("Debug")[0].text;
		
		//>> Verify Path
		var sPath = UTIL_STOR_Check_Path(Path);
		var sFile = sPath + "\\" + File;
		
		if (FSO.FileExists(sFile))
			FSO.DeleteFile(sFile, true);
		var oFile = FSO.CreateTextFile(sFile, true);
		
		//>> Save File, Close
		oFile.WriteLine(Data);
		oFile.Close();
	}
	catch(err){}
}

//Check Path
function UTIL_STOR_Check_Path(Path)
{
	try
	{
		Path = Path.split("/");
		var sPath = System.Shell.knownFolderPath(Path[0]);
		var i = 1;
		while (i < Path.length)
		{
			if (!FSO.FolderExists(sPath + "\\" + Path[i]))
				FSO.CreateFolder(sPath + "\\" + Path[i]);
			sPath += "\\" + Path[i];
			i++;
		}
		return sPath;
	}
	catch(err) {}		
}
//Omie