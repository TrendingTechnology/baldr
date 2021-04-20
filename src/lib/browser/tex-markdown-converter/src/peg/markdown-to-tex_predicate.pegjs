Start = (Heading / TextBody)+

TextBody = (Text '\n')+ / Text

Heading = '\n'? '# ' text:Text LineBreak {
  return '\\section{' + text + '}'
}

LineBreak = '\n\n'

Text = text:[a-zA-Z ]+ { return text.join('')  }
