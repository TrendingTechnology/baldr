// # Heading 1
// ## Heading 2
// ### Heading 3
// Lorem
// ipsum

// ### Heading 3

// Lorem
// ipsum

// ### Heading 3

// Lorem
// ipsum

// ### Heading 3

// Lorem
// ipsum

Markdown = (Heading / Paragraph)+

Heading =
  WhiteSpace? WhiteSpace? WhiteSpace?
  raute:'#'+ WhiteSpace+ text:TextOneLine LineBreak+ {
  	let macroName = 'section'
    if (raute.length === 2) {
    	macroName = 'subsection'
    } else if (raute.length === 3) {
    	macroName = 'subsubsection'
    }
 	return '\\' + macroName + '{' + text + '}'
 }

Paragraph = (LineBreak / WhiteSpace)* text:NotParagraphBreak+ (LineBreak LineBreak / !.) {
  return text.join('')
}

NotParagraphBreak = !(LineBreak LineBreak) text:. {
  return text
}

NotLineBreak = !LineBreak text:. {
  return text
}

TextOneLine = text:NotLineBreak+ {
  return text.join('')
}

WhiteSpace = [ \t]

LineBreak = '\n' / '\n\r'
