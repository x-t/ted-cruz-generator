function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var tedcruz = {};
var twURl = (x) => "https://twitter.com/intent/tweet?text="+x;

var intros = [
  "You look like a",
  "Need advice on how to be a",
  "Sit on my ding dong you",
  "how come you never answer my tweets you",
  "hey"
];

var insults = [
  " old canadian bitch",
  " hot dick hoochie mama",
  " pussy beans",
  " loser",
  " hot dick"
];

var oneoffs = [
  "eeeeh fuck you",
  "fuk u",
  "I would not fuck you with my daughter's dick",
  "https://www.youtube.com/watch?v=BF9n-PrnEMI",
  "pussy",
  "loser"
];

// shitButton

tedcruz.gentweet = function() {
  var a = getRandomInt(5), b = getRandomInt(5), c = getRandomInt(6),
  d = getRandomInt(3);
  if (d <= 1) // 0, 1 - traditional
  var str = '@tedcruz ' + intros[a] + insults[b];
  else // 2 - one-off
  var str = '@tedcruz ' + oneoffs[c];
  document.getElementById("tweet").innerHTML = str;
  document.getElementById('shitButton').innerHTML = "";
  twttr.widgets.createShareButton(
    ' ',
    document.getElementById('shitButton'),
    {
      size: "large",
      text: str
    },
    );
  }


window.onload = function () {
  tedcruz.gentweet();

}
  