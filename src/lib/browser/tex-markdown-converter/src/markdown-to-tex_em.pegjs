// Test: <em class="person">Ludwig van Beethoven</em>: <em class="piece">Für Elise</em>

{
  function toString(input) {
    return input.join('')
  }
}

InlineText = input:(Em / Text)+ {
  return toString(input)
}

Text = text:[a-zA-Z0-9:ü ]+ { return toString(text)  }

Em = '<em' WhiteBreak className:Class? '>' text:Text '</em>' {
  let macroName = 'emph'
  if (className != null) {
    switch (className) {
      case 'piece':
        macroName = 'stueck'
        break;
      case 'person':
        macroName = 'person'
        break;
      default:
        break;
    }
  }

  return '\\' + macroName + '{' + text +'}'
}

Class = 'class' WhiteBreak? '=' WhiteBreak? className:QuotedString {
  return className
}

QuotedString = SingleQuotedString / DoubleQuotedString

SingleQuotedString = '\'' text:Text '\'' {
  return text
}

DoubleQuotedString = '"' text:Text '"'  {
  return text
}

WhiteSpace = [ \t]+
WhiteBreak = WhiteSpace+ / LineBreak

LineBreak = '\n' / '\n\r'
