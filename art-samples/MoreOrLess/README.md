# MoreOrLess
This sample is a "guess-the-secret-number" game which illustrates the use of plugin capsule parts. A number of `Guesser` capsule instances try to guess a secret number in a round robin fashion. To make a guess an instance of a `Number` capsule is imported into the plugin part `number`. The guesser then asks for a hint if the secret number is more or less than the previous guess made. It can hence narrow down the interval that the secret number must be in. The `Guesser` makes a guess in the middle of the interval. If the guess is correct, the game ends. Otherwise the `Number` is deported from the plugin part so that the next guesser can use it for make a guess.

The application accepts two numeric command-line arguments. The first one specifies the number of guessers (by default 10) and the second specifies the upper bound of the interval for the secret number (by default 100). The lower bound of the interval is always 0.

For example, to let 20 guessers guess a number between 0 and 50:

```
.\Top.EXE -URTS_DEBUG=quit 20 50
```

Credit to [Queen's University](https://research.cs.queensu.ca/home/dingel/cisc844_F23/sampleModels/sampleModels.html) for the implementation.
