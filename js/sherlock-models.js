var SHERLOCK_CORE_MODEL = [
  "conceptualise a ~ sherlock thing ~ S that is an entity and is an imageable thing",
  "conceptualise an ~ organisation ~ O that is a sherlock thing",
  "conceptualise a ~ fruit ~ F that is a sherlock thing and is a locatable thing",
  "conceptualise a ~ room ~ R that is a location and is a sherlock thing",
  "conceptualise a ~ hat colour ~ C",
  "conceptualise a ~ sport ~ S",
  "conceptualise a ~ character ~ C that is a sherlock thing and is a locatable thing and has the hat colour C as ~ hat colour ~",
  "conceptualise the character C ~ works for ~ the organisation O and ~ eats ~ the fruit F and ~ plays ~ the sport S",
  "conceptualise the hat colour C ~ is worn by ~ the character C",
  "conceptualise an ~ object ~ O that is an entity",
  "conceptualise the object O ~ resides in ~ the room R",
  "conceptualise the room R ~ contains ~ the fruit F and has the character C as ~ contents ~ and has the object O as ~ additional contents ~",
  "conceptualise the fruit F ~ is eaten by ~ the character C",
  "conceptualise the sport S ~ is played by ~ the character C and ~ is in ~ the room R",
  "conceptualise a ~ question ~ Q that has the value V as ~ text ~ and has the value W as ~ value ~ and has the value X as ~ relationship ~",
  "conceptualise the question Q ~ concerns ~ the sherlock thing C",

  "there is a rule named r1 that has 'if the character C ~ eats ~ the fruit F then the fruit F ~ is eaten by ~ the character C' as instruction",
  "there is a rule named r2 that has 'if the character C ~ plays ~ the sport S then the sport S ~ is played by ~ the character C' as instruction",
  "there is a rule named r3 that has 'if the character C has the hat colour S as ~ hat colour ~ then the hat colour S ~ is worn by ~ the character C' as instruction",
  "there is a rule named r4 that has 'if the character C ~ is in ~ the room R then the room R has the character C as ~ contents ~' as instruction",
  "there is a rule named r5 that has 'if the fruit F ~ is in ~ the room R then the room R ~ contains ~ the fruit F' as instruction",
  
  // Inverse rules:
  "there is a rule named r6 that has 'if the fruit F ~ is eaten by ~ the character C then the character C ~ eats ~ the fruit F' as instruction",
  "there is a rule named r7 that has 'if the sport S ~ is played by ~ the character C then the character C ~ plays ~ the sport S' as instruction",
  "there is a rule named r8 that has 'if the hat colour S ~ is worn by ~ the character C then the character C has the hat colour S as ~ hat colour ~' as instruction",
  "there is a rule named r9 that has 'if the room R has the character C as ~ contents ~ then the character C ~ is in ~ the room R' as instruction",
  "there is a rule named r10 that has 'if the room R ~ contains ~ the fruit F then the fruit F ~ is in ~ the room R' as instruction",

  "there is a character named 'Prof Crane' that has 'http://sherlock.cenode.io/media/crane.png' as image",
  "there is a character named 'Dr Finch' that has 'http://sherlock.cenode.io/media/finch.png' as image",
  "there is a character named 'Col Robin' that has 'http://sherlock.cenode.io/media/robin.png' as image",
  "there is a character named 'Sgt Stork' that has 'http://sherlock.cenode.io/media/stork.png' as image",
  "there is a character named 'Rev Hawk' that has 'http://sherlock.cenode.io/media/hawk.png' as image",
  "there is a character named 'Capt Falcon' that has 'http://sherlock.cenode.io/media/falcon.png' as image",
  "there is a character named 'Elephant' that has 'http://sherlock.cenode.io/media/Elephant.png' as image",
  "there is a character named 'Giraffe' that has 'http://sherlock.cenode.io/media/Giraffe.png' as image",
  "there is a character named 'Hippopotamus' that has 'http://sherlock.cenode.io/media/Hippopotamus.png' as image",
  "there is a character named 'Leopard' that has 'http://sherlock.cenode.io/media/Leopard.png' as image",
  "there is a character named 'Lion' that has 'http://sherlock.cenode.io/media/Lion.png' as image",
  "there is a character named 'Zebra' that has 'http://sherlock.cenode.io/media/Zebra.png' as image",
  "there is a room named 'Ruby Room'",
  "there is a room named 'Sapphire Room'",
  "there is a room named 'Gold Room'",
  "there is a room named 'Amber Room'",
  "there is a room named 'Emerald Room'",
  "there is a room named 'Silver Room'",
  "there is a fruit named 'pineapple'",
  "there is a fruit named 'apple'",
  "there is a fruit named 'banana'",
  "there is a fruit named 'orange'",
  "there is a fruit named 'lemon'",
  "there is a fruit named 'pear'",
  "there is a fruit named 'grape'",
  "there is a fruit named 'kiwi'",
  "there is a fruit named 'tomato'",
  "there is a hat colour named 'green'",
  "there is a hat colour named 'red'",
  "there is a hat colour named 'yellow'",
  "there is a hat colour named 'black'",
  "there is a hat colour named 'white'",
  "there is a hat colour named 'purple'",
  "there is a hat colour named 'pink'",
  "there is a hat colour named 'blue'",
  "there is a hat colour named 'brown'",
  "there is a hat colour named 'grey'",
  "there is a sport named 'tennis'",
  "there is a sport named 'badminton'",
  "there is a sport named 'rugby'",
  "there is a sport named 'football'",
  "there is a sport named 'soccer'",
  "there is a sport named 'running'",
  "there is a sport named 'swimming'",
  "there is a sport named 'athletics'",
  "there is a sport named 'baseball'",
  "there is a sport named 'rounders'",
  "there is a sport named 'softball'",
  "there is a sport named 'cricket'",
  "there is a sport named 'golf'",
  "there is a sport named 'basketball'",

  "there is a rule named objectrule1 that has 'if the object O ~ resides in ~ the room R then the room R has the object O as ~ additional contents ~' as instruction",
  "there is an object named 'gorilla'",
  "there is an object named 'dinosaur'",
  "there is an object named 'robot'",
  "there is an object named 'ghost'",
  "there is an object named 'balloon'",

  "there is a question named 'q1' that has 'What character eats pineapples?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'pineapple'",
  "there is a question named 'q2' that has 'What sport does Zebra play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Zebra'",
  "there is a question named 'q3' that has 'What character eats apples?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'apple'",
  "there is a question named 'q4' that has 'What colour hat is Elephant wearing?' as text and has 'hat colour' as value and concerns the sherlock thing 'Elephant'",
  "there is a question named 'q6' that has 'Where is Giraffe?' as text and has 'is in' as relationship and concerns the sherlock thing 'Giraffe'",
  "there is a question named 'q7' that has 'What colour hat is Lion wearing?' as text and has 'hat colour' as value and concerns the sherlock thing 'Lion'",
  "there is a question named 'q8' that has 'Where is Lion?' as text and has 'is in' as relationship and concerns the sherlock thing 'Lion'",
  "there is a question named 'q9' that has 'Which character is in the emerald room?' as text and has 'contents' as value and concerns the sherlock thing 'Emerald Room'",
  "there is a question named 'q12' that has 'What character eats bananas?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'banana'",
  "there is a question named 'q13' that has 'What character is in the sapphire room?' as text and has 'contents' as value and concerns the sherlock thing 'Sapphire Room'",
  "there is a question named 'q17' that has 'What sport does Elephant play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Elephant'",
  "there is a question named 'q18' that has 'What character is wearing a red hat?' as text and has 'is worn by' as relationship and concerns the sherlock thing 'red'",
  "there is a question named 'q19' that has 'What character plays rugby?' as text and has 'is played by' as relationship and concerns the sherlock thing 'rugby'",
  "there is a question named 'q20' that has 'What fruit does Leopard eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Leopard'",
  "there is a question named 'q23' that has 'What fruit does Giraffe eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Giraffe'",
  "there is a question named 'q24' that has 'What colour hat is Zebra wearing?' as text and has 'hat colour' as value and concerns the sherlock thing 'Zebra'",
  "there is a question named 'q25' that has 'Where is the apple?' as text and has 'is in' as relationship and concerns the sherlock thing 'apple'",
  "there is a question named 'q26' that has 'What character is wearing a yellow hat?' as text and has 'is worn by' as relationship and concerns the sherlock thing 'yellow'",
  "there is a question named 'q28' that has 'What fruit is in the silver room?' as text and has 'contains' as relationship and concerns the sherlock thing 'Silver Room'",
  "there is a question named 'q30' that has 'What character is wearing a blue hat?' as text and has 'is worn by' as relationship and concerns the sherlock thing 'blue'",
  "there is a question named 'q31' that has 'What character eats lemons?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'lemon'",
  "there is a question named 'q33' that has 'What fruit does Elephant eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Elephant'",
  "there is a question named 'q34' that has 'What character plays basketball?' as text and has 'is played by' as relationship and concerns the sherlock thing 'basketball'",
  "there is a question named 'q35' that has 'What character plays soccer?' as text and has 'is played by' as relationship and concerns the sherlock thing 'soccer'",
  "there is a question named 'q36' that has 'What sport does Lion play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Lion'",
  "there is a question named 'q37' that has 'What character is in the ruby room?' as text and has 'contents' as value and concerns the sherlock thing 'Ruby Room'",
  "there is a question named 'q39' that has 'What character plays golf?' as text and has 'is played by' as relationship and concerns the sherlock thing 'golf'",
  "there is a question named 'q40' that has 'What character eats oranges?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'orange'",
  "there is a question named 'q41' that has 'What colour hat is Hippopotamus wearing?' as text and has 'hat colour' as value and concerns the sherlock thing 'Hippopotamus'",
  "there is a question named 'q45' that has 'What character is in the amber room?' as text and has 'contents' as value and concerns the sherlock thing 'Amber Room'",
  "there is a question named 'q47' that has 'Where is Elephant?' as text and has 'is in' as relationship and concerns the sherlock thing 'Elephant'",
  "there is a question named 'q48' that has 'Where is the pear?' as text and has 'is in' as relationship and concerns the sherlock thing 'pear'",
  "there is a question named 'q50' that has 'What fruit does Lion eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Lion'",
  "there is a question named 'q52' that has 'What sport does Giraffe play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Giraffe'",
  "there is a question named 'q53' that has 'Where is Hippopotamus?' as text and has 'is in' as relationship and concerns the sherlock thing 'Hippopotamus'",
  "there is a question named 'q54' that has 'What sport does Hippopotamus play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Hippopotamus'"
];

var SHERLOCK_NODE_MODEL = [
  "there is an agent named 'Mycroft' that has 'http://mycroft.cenode.io' as address",
  "there is a tell policy named 'p2' that has 'true' as enabled and has the agent 'Mycroft' as target",
  "there is a listen policy named 'p4' that has 'true' as enabled and has the agent 'Mycroft' as target"  
];
