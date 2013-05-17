/*
  	Copyright 2013 Uniclau S.L. (www.uniclau.com)
 	
  	This file is part of jPivot.

    jPivot is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    jPivot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with jPivot.  If not, see <http://www.gnu.org/licenses/>.
 */

function agregate_count(options) {
	this.agregate = function (a, b) {
		var res;
		if ((!a) || (a.type !== "agregate_count")) {
			res = {type: "agregate_count", count:0};
		} else {
			res = {type: "agregate_count", count:a.count};
		}
		if (b.type ==="agregate_count") {
			res.count += b.count;
		} else if (typeof b === "object") {
			res.count++;
		}
		return res;
	};
	
	this.getValue = function(a) {
		var res=null;
		if ((a) && (a.type === "agregate_count")) {
			res = a.count;
		} 
		return res;
	};
}

unc.jPivot.addAgregate('count',agregate_count);