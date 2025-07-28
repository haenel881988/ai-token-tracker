# Problemstellung: Tokenlängen und Kontextbegrenzung

Die KI hat eine Begrenzung der Tokenlänge, die sie verarbeiten kann. Diese Begrenzung ist entscheidend für die Stabilität und Genauigkeit der Antworten. Wenn diese Grenze überschritten wird, kann es zu Halluzinationen und fehlerhaften Ausgaben kommen.

# Lösung: Modularer Aufbau der Website
Die Website muss Modular aufgebaut sein. Damit ist gemeint, dass mit Scopes / Bereichen gearbeitet werden muss.
Hintergrund: Die KI hat eine Kontext bzw. Tokenbegrenzung. Wird diese Tokenbegrenzung überschritten, so beginnt die KI mit halluzinieren und lügen. Die KI beginnt irgendwelche Tools / Skripte auszuführen, hält sich nicht mehr an die Instruction. Das Verhalten der KI kann durch zu grosse Dateien instabil werden.
Daher muss für jedes Modul, eine separates jeden Scope, ein Verzeichniss / unterverzeichnis erstellt werden.

Beispielsweise nehmen wir das Thema CSS. Eine globale CSS Datei ist sehr problematisch, da diese Scopes in der Datei definiert wird, die KI muss somit die ganze Datei lesen.
Ab 1000 Zeilen wird es problematisch. Auch wenn ich Premiumanfragen stelle, z.b. an Claude Sonnet 4, so sind die max. Tokenlänge bei rund 200'000 nur eine theorethische Zahl. Denn, zu den Tokend zählen ja:
 - Der eigentliche Prompt im Chat
 - Der aktuelle Chatverlauf
 - Die "copilot-instructions.md Datei
 - Die Analyse der jeweiligen READMEs Verzeichnissen und Datei/en
 - Der interne Denkvorgang der KI
 - Die Ausgabe (Antwort der KI) des Inhalts, im Chat, und / oder der Datei.

Erkenntnis: Wenn die Tokenlänge / aka / Kontextlänge überschritten wird, beginnt die KI zu halluzinieren, zu lügen. Die KI ist verzweifelt weil sie wie blind Autofahren muss und nicht weiss, ob sie anhalten muss, wo es lang geht etc. Und dann beginnen die Unfälle in Form der Halluzination.

# Umsetzung Tokenberechnung
Die Tokenlänge muss mit einem Rechner exakt berechnet werden.
Ich, Simon, der User, nehme an, dass die KI ihrer Programmierung folge leisten muss, dem User zu helfen. Dabei besitzt leider die KI nlch keine Exception Funktion, wenn die KI blind wird. Ähnlich wie der Mensch, beginnt die KI eine Art vom schlechten Gewissen zu bekommen wenn sie blind wird, der User könnte sauer sein, wenn seine Anforderungen zu gross sind, daher beginnt die lieber Dinge zu tun, irgendwelche Ergebnisse zu produzieren an, statt eine Exception zu werfen.
Daher ist niemals die Tokenlänge entscheidend, sondern der Umgang damit.

Frage an die KI:
Bemerkst du, wenn du blind wirst, spührst du das? Wenn ja, wäre es möglich eine Art der Exception zu implementieren, eine Art der Erinnerung?
Wenn die KI aktuell ihre Grenzen nicht spüren kann, wäre es möglich, eine Art Analyze-Tool zu entwickeln, dass die exakte Tokenlänge berechnet für eine Aufgabe?


