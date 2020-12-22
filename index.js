let url = 'pdfs/out.pdf';

let pdf = null,
    pageNum = 1,
    rendered = [],
    numberOfPages = 0,
    firstPagesRendered = false,
    scale = 0.6;

function renderPage(num) {
    pdf.getPage(num).then(function (page) {
            let scale = 1.0;
            let viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            let canvasID = 'canv' + num;
            let canvas = document.getElementById(canvasID);
            if (canvas == null) return;
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);

            // Update page counters
            document.getElementById('page-number').textContent = pageNum;
            document.getElementById('number-pages').textContent = pdf.numPages;
        }
    )
}

// Adds the pages that the book will need
function addPage(page, book) {
    // 	First check if the page is already in the book
    if (!book.turn('hasPage', page)) {

        // Create an element for this page
        let element = $('<div />', {'class': 'page ' + ((page % 2 === 0) ? 'odd' : 'even'), 'id': 'page-' + page});
        element.html('<div class="data"><canvas id="canv' + page + '"></canvas></div>');

        // If not then add the page
        book.turn('addPage', element, page);
    }
}

$(window).ready(function () {
    addHref(url);
    PDFJS.disableWorker = true;

    PDFJS.getDocument(url).then(function (pdfDoc) {
        numberOfPages = pdfDoc.numPages;
        pdf = pdfDoc;
        $('#book').turn.pages = numberOfPages;

        $('#book').turn({
            acceleration: false,
            pages: numberOfPages,
            elevation: 50,
            gradients: !$.isTouch,
            // display: 'single',
            when: {
                turning: function (e, page, view) {

                    // Gets the range of pages that the book needs right now
                    let range = $(this).turn('range', page);

                    // Check if each page is within the book
                    for (page = range[0]; page <= range[1]; page++) {
                        addPage(page, $(this));
                        //renderPage(page);
                    }
                },

                turned: function (e, page) {
                    $('#page-number').val(page);

                    if (firstPagesRendered) {
                        let range = $(this).turn('range', page);
                        for (page = range[0]; page <= range[1]; page++) {
                            if (!rendered[page]) {
                                renderPage(page);
                                rendered[page] = true;
                            }
                        }
                    }
                }
            }
        });

        $('#number-pages').html(numberOfPages);

        $('#page-number').keydown(function (e) {

            let p = $('#page-number').val();
            if (e.which === 13) {
                $('#book').turn('page', p);
                renderPage(p);
            }

        });

        let n = numberOfPages;
        if (n > 6) n = 6;
        for (page = 1; page <= n; page++) {
            renderPage(page);
            rendered[page] = true;
        }
        firstPagesRendered = true;
    });
});

$(window).bind('keydown', function (e) {
    if (e.target && e.target.tagName.toLowerCase() != 'input')
        if (e.which === 37)
            nextPage('previous');
        else if (e.which === 39)
            nextPage('next');
});


function nextPage(direction) {
    $('#book').turn(direction);
}

function addHref(archive) {
    $('#controls .download').attr("href", archive);
}

function changeNextPage() {
    $('#controls .left .direction').click((event) => {
        nextPage(event.target.innerText);
    });
}

changeNextPage();
