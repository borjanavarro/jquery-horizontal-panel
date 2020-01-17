# jquery-horizontal-panel
An horizontal scroll plugin for displaying messages as a LED panel or similar.

<h2>Default settings</h2>

<ul>
  <li>duration: 10000</li>
  <li>padding: 0</li>
  <li>marquee_class: '.marquee'</li>
  <li>content_class: '.content'</li>
  <li>fixed_class: 0</li>
  <li>hover: true</li>
  <li>focus: true</li>
  <li>stop: false</li>
</ul>

<h2>JQuery calls</h2>

$( selector ).hpanel(); // Creates the panel and accepts settings as arguments<br>
$( selector ).pause();<br>
$( selector ).resume();<br>
$( selector ).switchOff();
