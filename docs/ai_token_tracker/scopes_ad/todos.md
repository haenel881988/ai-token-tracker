In dieser Datei soll die Extension eine detaillierte todo-liste erstellen, die alle notwendigen Schritte enthält, um den Token-Verbrauch zu optimieren und Halluzinationen zu vermeiden. Die KI soll in der Lage sein, diese Aufgaben in kleinere, handhabbare Teile zu unterteilen und sie in einem strukturierten Format zu präsentieren.

Die Extension soll dabei sämtliche Probleme auflisten, die die Tokenlänge überschreiten.

Die Extension soll automatisch den Modus und das Modell erkennen um die Token-Limits automatisch zu erkennen und zu setzen.


Hier "docs\ai_token_tracker\scopes_ad" werden die Anweisungen die an die KI gestellt werden, von der KI in Scopes aufgesplittet, um die Token-Verwendung besser zu überwachen.

Dabei soll in dem Verzeichnis das Projekt zuerst mal abgebildet werden, um die Struktur zu verdeutlichen. Die Extension soll dann automatisch die notwendigen Scopes innerhalb von docs\ai_token_tracker\scopes_ad" simulieren, in form von verzeichnissen und den Dateien, wie eine Modularisierung aussieht.

In meinem Fall, nehmen wir das max. Limit von 64'000 Tokens. Damit wir die Extension testen und erweitern können. Die KI Modelle bekommen Probleme, auch wenn sie unterhalb der Tokenslimits arbeiten, da oft die Kette der Token nicht beachtet wird.
Man müsste schon fast von brutto- und netto-Tokens sprechen, da die KI Modelle auch die Tokens der Anweisungen, der Antworten und des Chatverlaufs berücksichtigen müssen.
Dabei soll die Extension basierend auf den best-practices, automatisch ermitteln, wie viele Tokens für die Aufgabe verwendet werden können bis zum break-even Point, wo die KI anfängt zu halluzinieren oder unsinnige Antworten zu geben. Dies kann auch schon bei 90% der Fall sein, wenn besonders komplexe Anfragen gestellt werden.
Dabei soll die Extension einen Algorithmus implementiert werden, um diesen break-even Point zu evaluieren.
Dabei soll die Extension die KI Anweisen, dabei soll die Extension eine Art Vorlage für eine Anweisung liefern, die nicht nur die Rollen, die Intention und die Anweisung selbst enthält, sondern auch dass der Prompt SMART sein soll.


Dabei soll die KI mittels dem ai-token-tracker in der Lage sein, den Token-Verbrauch zu optimieren und Halluzinationen zu vermeiden. Wenn das Limit der Tokens bei 75% ausgelastet ist, muss spätestens dann die KI die Anweisungen aufsplitten und in einer Todo-Aufgabe, die ebenfalls unterteilt ist, in form von unter-verzeichnissen und unter-Dateien, die Anweisungen aufteilen, um den Token-Verbrauch zu optimieren und Halluzinationen zu vermeiden.