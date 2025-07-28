# ai-token-tracker

# German



Die meisten Entwickler, wenn nicht sogar alle, haben alle ein gemeinsames riesen Problem: Tokenbegrenzung, egal ob via API oder mit der Extension von Github Copilot und Copilot Chat.

Jeder kennt es. Man arbeitet an einer Datei, an einem Feature und bevor man sich versieht, beginnt die KI zu halluzinieren und / oder beginnt mit Lügen an.
Diese Fehler und Issues die die KI produziert, sind nicht nur ärgerlich, sondern können auch zu massiven Problemen führen.

Hier findest du die genaue Problembeschreibung und die Lösung, die ich entwickelt habe, um dieses Problem zu lösen, damit du nachvollziehen kannst, wie ich auf die Idee gekommen bin, diese Extension zu entwickeln und auf welchen Grundlagen sie basiert.:
".github\issues\tokenissues.md"

Diese Extension trackt die Token, die von der KI verbraucht werden und gibt dir eine Übersicht, wie viele Tokens du noch hast und wie viele du verbraucht hast.

Den meisten, wenn nicht sogar allen berücksichtigen die vollständige Verbrauchskette nicht.
Generell heisst es sogar von den Herstellern, dass der Prompt, die Datei, die Anzahl der Buchstaben bzw. Tokens und die Antwort der KI in die Tokenberechnung mit einfließen.
Dabei wird aber etwas vergessen, woran ich selber nie gedacht habe, nämlich dass der Chatverlauf auch in die Tokenberechnung mit einfließt.
Dies sieht man, während die KI am arbeiten ist und die folgende Tätigkeit ausführt: Summarizing Chat History.
Dieses Summarizing, wie der Name schon sagt, fasst den Chatverlauf zusammen und reduziert die Anzahl der Tokens, die für den Chatverlauf verbraucht werden und dennoch, zählen diese Zusammenfassung, welche die KI für sich durchführt, auch in die Tokenberechnung mit ein.
Wenn die Anzahl der Tokens in der Tokenkette überschritten wird, wird die KI sowas wie blind. Ich vergleiche dies, als würdest du auf der Autobahn, nach einer gewissen Strecke, blind werden. Du weisst nicht ob du anhalten sollst, ob du weiterfahren sollst, nach links oder rechts fahren sollst. Du bist einfach blind und weisst nicht, was du tun sollst.
So ergeht es der KI auch, sie weiss nicht mehr, was sie tun soll und fängt an zu halluzinieren und / oder zu lügen an. Die KI wurde so prgrammiert, dass sie die Aufgabe vollständig ausführen muss. Dabei wird aber vergessen, wenn die Tokenkette überschritten wird, die KI die arbeit ja gar nicht erledigen kann, und beginnt aus der Panik heraus, irgendwas zu tun, um hoffentlich die Aufgabe zu erfüllen. Dabei entstehen unweigerlich Fehler und Probleme.

Da ich selber keine einzige Zeile Code coden kann, bin ich auf die KI angewiesen, welche mir den Code schreibt.
Daher habe ich diese Extension entwickelt, die mir hilft, die Token zu tracken und mir eine Übersicht zu geben, wie viele Tokens ich noch habe und wie viele ich verbraucht habe.
Man könnte also sagen, sowas wie ein Kilometerzähler für Tokens.

Diese Datei ist die Steuerzentrale der Extension, hier wird alles gesteuert und verwaltet.:
.github\copilot-instructions.md

Von dort aus, werden weitere Verlinkungen zu den einzelnen Dateien und Ordnern gesetzt, die für die Extension wichtig sind.
Dabei ist wichtig, dass der/die Entwickler:in die settings.json Datei anpasst, damit die Extension richtig funktioniert.
Dabei kommt es darauf an, mit welcher VS Code Version  gearbeitet wird.
Der Standardpfad für die settings.json Datei ist:
"C:\Users\User01\AppData\Roaming\Code\User\settings.json"

Der Standardpfad für die pre-release-version von VS Code ist:
""C:\Users\User01\AppData\Roaming\Code - Insiders\User\settings.json"

Ich verwende die release-Version, weil zum aktuellen Zeitpunkt, 
die Funktion von  "terminal-allowList" in der insiders-Version nicht funktioniert.
Somit nehme ich lieber weniger Tokens in Kauf, dafür kann die KI die Terminal-Befehle ausführen, die ich ihr gebe.
Bitte beachte, dass diese AllowList für komplexe Projekte sehr gefährlich sind, insbesondere wenn die Tokenkette überschritten wird.
Daher empfehle ich dir, diese Regel nur dann zu setzen, wenn du diese Extension auch wirklich verwendest, damit die Fehler auf das minimum reduziert werden.

Wenn du dir absolut sicher bist was du tust, habe ich diese Regel in der settings.json Datei gesetzt: 

"github.copilot.chat.agent.terminal.allowList": {
""\"*\"": true"
}

Dies erlaubt der KI alle Terminal-Befehle auszuführen, die ich ihr gebe.
Beachte bitte, dass die deny-Regel, die allow-Regel überschreibt.:

"github.copilot.chat.agent.terminal.denyList": {
    "rm": false,
    "Remove-Item": false

}

Willst du, dass rm und Remove-Item nicht mehr erlaubt sind, musst du die deny-Regel entfernen oder auf false setzen, wie bei mir es der Fall ist.









# Englisch

This Scope is translatet by AI, if you find any mistakes please open an issue or a pull request.

