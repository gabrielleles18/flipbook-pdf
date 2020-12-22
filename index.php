<html>
<header>
    <script src="libs/jquery.js"></script>
    <script src="libs/pdf.js"></script>
    <script src="libs/turn.js"></script>

    <link rel="stylesheet" href="index.css">
    <title>FlipBook PDF</title>
    </head>
</header>
<body>
<div id="controls">
    <div class="left">
        <div class="direction">
            <i id="previous">previous</i>
            |
            <i id="next">next</i>
        </div>
        <div class="pages">
            <input type="text" size="3" id="page-number"> de <span id="number-pages"></span>
        </div>
    </div>
    <div class="center">
        <div class="zoom">
            <i>-</i>
            |
            <i>+</i>
        </div>
    </div>
    <div class="right">
        <a class="download" download>download</a>
    </div>
</div>
<div id="book">
</div>
</body>
</html>
<script src="index.js"></script>
