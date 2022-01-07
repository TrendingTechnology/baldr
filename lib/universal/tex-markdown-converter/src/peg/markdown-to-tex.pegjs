// 09 This is <b>a</b> tes1t. 09 xydsdfdf s df asd 1 2 as

Paragraph = (Fett / InlineText) +

InlineText = (Number / String)+

Number = number:[0-9]+ {
	return {
    	number: number.join('')
       }
}

StringChar = buchstabe:(!Number+ !'<' .) {
  return buchstabe[2]
}

String = text:StringChar+ {


	return {
    	string: text.join('')
       }
}

Fett = '<b>' text:InlineText  '</b>' {
	return text[0].string

}
