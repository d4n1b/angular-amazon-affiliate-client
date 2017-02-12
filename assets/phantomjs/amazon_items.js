var casper = require('casper').create({
        pageSettings: {
            webSecurityEnabled: false
        },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }),
    fs = require('fs');


// App
//
var amazonUrlQuery = 'https://www.amazon.es/s/ref=nb_sb_noss_2?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=querys-alias%3Daps&field-keywords=',
    
    startTime = _getTimeNow(),

    endTime,

    saveDirectory = fs.workingDirectory,

    links = [],

    querys = [
        {
            'rings': [
                'engagement rings',
                'wedding rings',
                'gold rings',
                'silver rings',
                'cheap engagement rings',
                'diamonds rings',
            ]
        },
        {
            'brooches': [
                'original brooches',
                'hair pins',
                'silver brooches',
                'handmade brooches',
                'vintage brooches',
                'gold brooches',
                'wedding brooches',
            ],
        },
        {
            'pendants': [
                'silver pendants',
                'viceroy pendants',
                'gold pendants',
                'men pendants',
                'custom pendants',
                'pendants with names',
                'swarovski pendants',
            ],
        },
        {
            'necklaces': [
                'fashion necklaces',
                'ethnic necklaces',
                'pearl necklaces',
                'long necklaces',
                'leather necklaces',
                'original necklaces',
                'jewelery necklaces',
                'handmade necklaces',
            ],
        },
        {
            'charms': [
                'cheap charms',
                'viceroy charms',
                'silver charms',
                'gold charms',
                'charms bracelets',
                'swarovski charms',
            ],
        },
        {
            'earrings': [
                'bridal earrings',
                'silver earrings',
                'men earrings',
                'gold earrings',
                'long earrings',
                'swarovski earrings',
                'original earrings',
            ],
        },
        {
            'bracelets': [
                'leather bracelets',
                'custom bracelets',
                'rubber bracelets',
                'fashion bracelets',
                'silver bracelets',
                'gold bracelets',
                'handmade bracelets',
            ],
        }
    ];

// Start Time
casper.echo('Started at: ' + startTime, 'GREEN_BAR');


// Set the querys in the base url
// ------------------------
for( var i=0; i<querys.length; i++ ) {
    for( var category in querys[i] ) {
        for( var j=0; j<querys[i][category].length; j++ ) {
            links.push({
                category: category,
                link: amazonUrlQuery + querys[i][category][j],
                query: querys[i][category][j],
            });
        }
    }
}


// Run the scrapping
// ------------------------
casper.start().each( links, function( self, key ) {
    self.thenOpen( key.link, function() {

        var i = 0,
            products,
            tmpPath = './tmp/',
            title = this.getTitle(),
            
            // // Save with category
            // saveJSONFolder = tmpPath + key.category + '/' + key.query + '/products.json',
            // saveImageFolder = tmpPath + key.category + '/' + key.query + '/';
            
            // Save without category
            saveJSONFolder = tmpPath + key.query + '/products.json',
            saveImageFolder = tmpPath + key.query + '/';
            

        this.page.injectJs('lib/jquery-2.1.4.min.js');

        products = this.evaluate( function () {

            var result = [],
                selector = 'div.s-item-container';

            $(selector).each( function() {
                var $this = $( this ),
                    name = $this.find('h2.a-size-medium').text(),
                    amazonUrl = $this.find('img.s-access-image').attr('src'),
                    url = amazonUrl.split('/').slice(-1).join('').replace(/%/g, ''),
                    link = $this.find('a.a-link-normal').attr('href'),
                    price = $this.find('span.a-size-base').first().text();

                result.push({
                    name: name,
                    url: url,
                    amazonUrl: amazonUrl,
                    link: link,
                    price: price
                });

            });

            return result;
        });


        // save images
        // --------------------------------
        for(; i<=products.length; i++ ) {
            try {
                var product = products[i];
                this.download( product['amazonUrl'], saveImageFolder + product['url'], 'GET' );
            } catch( err ) {
                delete products[i];
            }
        }

        fs.write( saveJSONFolder, JSON.stringify( products ) );

        // Report done
        this.echo( 'Key: "' + key.query + '" at: ' + _getTimeNow(), 'INFO' );
    });
});


// Exit the process
// ------------------------
casper.run(function() {
    endTime = _getTimeNow();
    this.echo('Done at: ' + endTime, 'GREEN_BAR').exit();
});

function _getTimeNow() {
    return (new Date() + '') .split(' ').slice(0,5).join(' '); // get time without GMT
}