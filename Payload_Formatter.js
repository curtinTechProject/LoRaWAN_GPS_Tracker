{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 function Decoder(bytes, port) \{\
  var decoded = \{\};\
\
  // Decode 1-byte variables\
  var hour = (bytes[1] << 8) | bytes[0];                 // 1 byte for hour\
  var minute = (bytes[3] << 8) | bytes[2];               // 1 byte for minute\
  var second = (bytes[5] << 8) | bytes[4];               // 1 byte for second\
  var centisecond = (bytes[7] << 8) | bytes[6];          // 1 byte for centisecond\
\
  // Decode 4-byte floats (IEEE 754 format for floats)\
  var latitude = bytesToFloat(bytes.slice(8, 12))  // Combine bytes[4] to bytes[7] for longitude\
  var longitude = bytesToFloat(bytes.slice(12, 16));  // Combine bytes[8] to bytes[11] for latitude\
\
  // Format the time into a string HH:MM:SS:CC\
  decoded.utc_time = `$\{String(hour).padStart(2, '0')\}:$\{String(minute).padStart(2, '0')\}:$\{String(second).padStart(2, '0')\}:$\{String(centisecond).padStart(2, '0')\}`;\
\
  // Add longitude and latitude to the decoded object\
  decoded.longitude = longitude;\
  decoded.latitude = latitude;\
\
  return decoded;\
\}\
\
function bytesToFloat(bytes) \{\
  //LSB Format (least significant byte first).\
  var bits = bytes[3]<<24 | bytes[2]<<16 | bytes[1]<<8 | bytes[0];\
  var sign = (bits>>>31 === 0) ? 1.0 : -1.0;\
  var e = bits>>>23 & 0xff;\
  var m = (e === 0) ? (bits & 0x7fffff)<<1 : (bits & 0x7fffff) | 0x800000;\
  var f = sign * m * Math.pow(2, e - 150);\
  return f;\
\}\
}