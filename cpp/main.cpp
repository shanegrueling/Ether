/*****************************************************************************
 * Copyright 2011 Shane Grüling (shane.grueling@portalwelten.de)
 *
 * This file is part of Ether.
 *
 * Ether is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Ether is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Ether.  If not, see <http://www.gnu.org/licenses/>.
 *****************************************************************************/

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <boost\regex.hpp>

std::vector<std::string> vector;
int numberOfFiles = 0;
std::string getFile(const std::string& path, const std::string& file);

class EtherFile {
private:
	bool debugBlockOn;
	const std::string path;
	const std::string name;

	std::string parseEtherLine(const std::string& oldMatch, std::string& line); 
	std::string parseIncludeLine(const std::string& oldMatch, std::string& line);
	std::string parseDebugLine(const std::string& oldMatch, std::string& line);

public:
	EtherFile(const std::string& path, const std::string& name):name(name),path(path),debugBlockOn(false) {};
	std::string parse();
};

std::string EtherFile::parse()
{
	boost::regex e(".*(Ether\\.(.+);)");
	
	std::ifstream file;

	std::string pathFile;
	pathFile.append(this->path);
	pathFile.append("/");
	pathFile.append(this->name);
	++numberOfFiles;
	std::cout << "Parsing file " << pathFile << std::endl;

	std::string returnFile;

	boost::smatch match;

	file.open( pathFile );
	if(file.is_open())
	{
		std::string line;
		while(!file.eof())
		{
			std::getline(file, line);
			//Check if Compiler instruction is in this line
			if(boost::regex_match(line, match, e))
			{
				line.assign(parseEtherLine(match[2], line));
			}
			if(!file.eof() && line.length() > 0)
			{
				line.append("\n");
			}
			if(debugBlockOn)
			{
				line.assign("");
			}
			returnFile.append(line);
		}
		file.close();
	} else {
		std::cout << "Can't open file" << std::endl;
	}

	return returnFile;
}

std::string EtherFile::parseEtherLine(const std::string& oldMatch, std::string& line)
{
	boost::regex include("include\\.(.*)");
	boost::regex debug("debug\\.(.*)");

	boost::smatch match;

	if(!debugBlockOn && boost::regex_match(oldMatch, match, include))
	{
		return parseIncludeLine(match[1], line);
	} else if(boost::regex_match(oldMatch, match, debug)) {
		return parseDebugLine(match[1], line);
	} 

	return std::string("");

}

std::string EtherFile::parseIncludeLine(const std::string& oldMatch, std::string& line)
{
	boost::regex JavaScript("JavaScript\\([\"'](.+)[\"']\\)");
	boost::regex JSON("JSON\\([\"'](.+)[\"']\\)");
	boost::regex HTML("HTML\\([\"'](.+)[\"']\\)");

	boost::smatch match;

	if(boost::regex_match(oldMatch, match, JavaScript))
	{
		if(std::find(vector.begin(), vector.end(), match[1])==vector.end())
		{
			vector.push_back(match[1]);
			EtherFile file(path, match[1]);
			return file.parse();
		}
	} else if(boost::regex_match(oldMatch, match, JSON)) {
		std::string ret("Ether.include.");
		ret.append(match[0]);

		return line.replace(line.find(ret), ret.length(), getFile(path, match[1]));
	}

	return std::string("");
}

std::string EtherFile::parseDebugLine(const std::string& oldMatch, std::string& line)
{
	boost::regex blockStart("block.start\\(\\)");
	boost::regex blockEnd("block.end\\(\\)");

	boost::smatch match;

	if(boost::regex_match(oldMatch, match, blockStart))
	{
		this->debugBlockOn = true;
	} else if(boost::regex_match(oldMatch, match, blockEnd)) {
		this->debugBlockOn = false;
	}

	return std::string("");
}

int main( int argc, char* argv[] )
{
	if(argc < 3)
	{
		std::cout << "ether BASEPATH START_SCRIPT PATH_TO_PLACE_THE_FINAL_FILE" << std::endl;
		return 1;
	}
	std::string path;
	path.assign(argv[1]);
	std::string name;
	name.assign(argv[2]);

	std::ofstream fileStream;

	EtherFile file(path, name);

	fileStream.open(argv[3]);
	fileStream << file.parse();
	fileStream.close();
	return 1;
}

std::string getFile(const std::string& path, const std::string& name)
{
	std::ifstream file;

	std::string pathFile;
	pathFile.append(path);
	pathFile.append("/");
	pathFile.append(name);
	++numberOfFiles;
	std::cout << "Including file " << pathFile << std::endl;

	std::string returnFile;

	file.open( pathFile );
	if(file.is_open())
	{
		std::string line;
		while(!file.eof())
		{
			std::getline(file, line);
			returnFile.append(line);
		}
		file.close();
	} else {
		std::cout << "Can't open file" << std::endl;
	}

	return returnFile;
}