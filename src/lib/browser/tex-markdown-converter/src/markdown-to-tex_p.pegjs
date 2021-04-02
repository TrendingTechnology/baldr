// Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
// sed diam nonumy eirmod tempor invidunt ut labore et dolore
// magna aliquyam erat, sed diam voluptua.

// At vero eos et accusam et justo duo dolores et ea rebum.

// Stet clita kasd gubergren, no sea takimata sanctus est

start = head:Para tail:(newline Para)*
   {
      const t = tail.reduce(function(memo, element) {
         return memo.concat(element[1]);
      }, []);
      return  [ head ].concat(t)
   }

Para = text:LineOfText+
   { return  text.join('\n') }

LineOfText = text:$(char+) EOL
   { return text }

char = [^\n\r]
newline = '\n' / '\r' '\n'?
EOL = newline / !.
