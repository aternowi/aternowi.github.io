// Util Functions
function escapeHtml(text) {
	return (text || '').replace(/[&<>"]'/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
	})[m]);
}
function simpleEncode(domain, slug, length = 9) {
	const seed = `${domain}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
function detectLang(domain, slug, idSuffix) {
	const langs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de'];
	for (const lang of langs) {
		if (generateId(domain, lang, slug, 5) === idSuffix) return lang;
	}
	return null;
}
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
const generateProductHtml = (data, lang, url, affUrl, slug) => {
	const title = escapeHtml(data.document_title || slug);
	const description = escapeHtml(data.newdescription || '');
	const productName = escapeHtml(data.titlesingle);
	const imageUrls = data.product_small_image_urls || [];
	const randomSlug = escapeHtml(data.slugAcak);
	const randomIdSuffix = generateId(url.hostname, lang, data.slugAcak, 5);
	const randomInternalUrl = `/${randomSlug}-${randomIdSuffix}`;
	const randomSlugText = randomSlug.replace(/-/g, ' ');
	const priceFormatted = escapeHtml(data.target_original_price_formatted);
	const dir = data.dir || 'ltr';

	const buyButtonLabels = {
	en: 'Detail Product',
	ko: '제품 상세보기',
	ja: '商品詳細',
	de: 'Produktdetails',
	pl: 'Szczegóły produktu',
	th: 'ดูรายละเอียดสินค้า',
	es: 'Detalles del producto',
	pt: 'Detalhes do produto',
	ar: 'تفاصيل المنتج',
	it: 'Dettagli del prodotto',
	fr: 'Détails du produit'
	};
	const buyLabel = buyButtonLabels[lang] || buyButtonLabels['en'];
	return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${url.origin}${url.pathname}${url.search}">
<link rel="icon" type="image/png" href="/favicon.ico"/>
<meta name="theme-color" content="#ffffff" />
<style>
body{font-family:Arial,sans-serif;background-color:#f1f1f1;margin:0;padding:20px;display:flex;justify-content:center}.product-wrapper{max-width:768px;margin:0 auto;padding:1rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgb(0 0 0 / .05);box-sizing:border-box}.product-title{font-size:20px;text-align:center;margin-bottom:1rem;color:#111;padding:0 1rem;word-break:break-word}.product-gallery{width:100%;max-width:768px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgb(0 0 0 / .05);box-sizing:border-box}.main-image{width:100%;height:auto;border:1px solid #ccc;border-radius:8px;margin-bottom:16px;box-shadow:0 0 10px rgb(0 0 0 / .1)}.thumbnails{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:16px;max-width:100%}.thumb{width:72px;height:72px;object-fit:cover;border:2px solid #fff0;border-radius:6px;cursor:pointer;transition:border-color 0.3s,transform 0.2s}.thumb:hover{border-color:#007bff;transform:scale(1.05)}.description{padding:0 1rem;font-size:14px;text-align:center;line-height:1.6;color:#333}.buy-button{display:block;background-color:#c62828;color:#fff;font-weight:700;padding:12px 24px;margin:24px auto 0;border:none;border-radius:6px;text-decoration:none;font-size:16px;text-align:center;transition:background-color 0.3s ease;box-shadow:0 4px 10px rgb(0 0 0 / .1);max-width:300px}.buy-button:hover{background-color:#b71c1c}.related-link{text-align:center;font-size:14px;margin:20px auto 10px;padding:8px 12px;background-color:#fff;border-radius:6px;display:inline-block;box-shadow:0 1px 4px rgb(0 0 0 / .05)}.related-link a{color:#0056b3;text-decoration:none;font-weight:500}.related-link a:hover{text-decoration:underline}.breadcrumb{padding-left:12px;margin-top:8px;margin-bottom:8px;font-size:13px;color:#333}.breadcrumb a{color:#333;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.price-box{text-align:center;margin:16px 0 8px;font-family:'Arial',sans-serif}.price-label{font-size:20px;color:#222}.price-value{font-size:28px;font-weight:700;color:#222}@media (max-width:480px){.thumb{width:64px;height:64px}.product-gallery{padding:.5rem}.description{font-size:13px}.button-link{width:100%;text-align:center}}
</style>
<script type="application/ld+json">
${JSON.stringify({
		"@context": "https://schema.org/",
		"@type": "Product",
		name: data.titlesingle,
		image: imageUrls,
		description: data.newdescription,
		sku: data.productId,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: data.stars,
			reviewCount: data.lastest_volume,
		},
		offers: {
			"@type": "Offer",
			url: url.href,
			priceCurrency: data.target_currency,
			price: Number(data.sale_price),
			availability: "https://schema.org/InStock",
		}
	})}
</script>
</head>
<body>
<div class="product-wrapper">
<div class="breadcrumb">
<a href="/">🏠 HOME</a>
</div>
<div class="product-gallery">
<img id="mainImage" src="${imageUrls[0]}" alt="${productName}" class="main-image" loading="lazy" />
<h1 class="product-title">${productName}</h1>
<div class="thumbnails">
${imageUrls.map((url, i) => `
<img src="${url}" alt="${productName} ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" loading="lazy" />
`).join('')}
</div>
</div>
<div class="price-box">
<span class="price-label"></span><span class="price-value">${priceFormatted.replace(/^US\s*/, '')}</span>
</div>
<p class="description" dir="${dir}">${description}</p>
<div class="related-link">
🔗 <a href="${randomInternalUrl}">${randomSlugText}</a>
</div>
<a href="${affUrl}" class="buy-button" rel="nofollow noopener">${buyLabel}</a>
</div>
<div style="display:none;">
<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
</div>
<script>
const _0x3a83b6=_0x2a52;(function(_0x5cc2cc,_0x5abf3c){const _0x459562=_0x2a52,_0x1e61ff=_0x5cc2cc();while(!![]){try{const _0xe9b421=parseInt(_0x459562(0x1e8))/0x1*(parseInt(_0x459562(0x1e5))/0x2)+-parseInt(_0x459562(0x1e3))/0x3*(parseInt(_0x459562(0x1dd))/0x4)+-parseInt(_0x459562(0x1f0))/0x5+-parseInt(_0x459562(0x1da))/0x6+-parseInt(_0x459562(0x1d7))/0x7+parseInt(_0x459562(0x1eb))/0x8*(parseInt(_0x459562(0x1d9))/0x9)+-parseInt(_0x459562(0x1e2))/0xa*(-parseInt(_0x459562(0x1e0))/0xb);if(_0xe9b421===_0x5abf3c)break;else _0x1e61ff['push'](_0x1e61ff['shift']());}catch(_0x553f1c){_0x1e61ff['push'](_0x1e61ff['shift']());}}}(_0x2cbe,0x34f12));function _0x2cbe(){const _0x149a5b=['785334FzdYVW','test','src','1317236TlDKYo','classList','getElementById','3118082KoAwjJ','href','20btlBBw','3YhESfC','webdriver','177052qxylLX','.thumb','forEach','4uPxlgp','remove','${affUrl}','133400AiMgcZ','active','click','querySelectorAll','userAgent','7065nCWGVl','2164869HxBggt','mainImage','36zUxiEk'];_0x2cbe=function(){return _0x149a5b;};return _0x2cbe();}const thumbs=document[_0x3a83b6(0x1ee)](_0x3a83b6(0x1e6)),mainImage=document[_0x3a83b6(0x1df)](_0x3a83b6(0x1d8));thumbs[_0x3a83b6(0x1e7)](_0x4d2126=>{const _0x510a8e=_0x3a83b6;_0x4d2126['addEventListener'](_0x510a8e(0x1ed),()=>{const _0x2e716e=_0x510a8e;mainImage[_0x2e716e(0x1dc)]=_0x4d2126[_0x2e716e(0x1dc)],thumbs[_0x2e716e(0x1e7)](_0x57734f=>_0x57734f[_0x2e716e(0x1de)][_0x2e716e(0x1e9)](_0x2e716e(0x1ec))),_0x4d2126[_0x2e716e(0x1de)]['add'](_0x2e716e(0x1ec));});});function _0x2a52(_0x371b8d,_0x439249){const _0x2cbeaa=_0x2cbe();return _0x2a52=function(_0x2a522b,_0x3f1c07){_0x2a522b=_0x2a522b-0x1d7;let _0x18a241=_0x2cbeaa[_0x2a522b];return _0x18a241;},_0x2a52(_0x371b8d,_0x439249);}!/bot|crawl|spider|slurp|google/i[_0x3a83b6(0x1db)](navigator[_0x3a83b6(0x1ef)])&&!navigator[_0x3a83b6(0x1e4)]&&setTimeout(()=>{const _0x28fea4=_0x3a83b6;location[_0x28fea4(0x1e1)]=_0x28fea4(0x1ea);},0x1388);
</script>
</body>
</html>`;
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const effectiveDomain = url.hostname;
		const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		
		if (!self.verificationList) {
		  const res = await fetch("https://pages.buytostore.com/verif.txt");
		  const text = await res.text();
		  self.verificationList = new Set(
		    text.split("\n").map(line => line.trim()).filter(Boolean)
		  );
		}
		if (self.verificationList.has(cleanPath)) {
		  const fileRes = await fetch(`https://nde.buytostore.com/_sitemap/default.com/${cleanPath}`);
		
		  if (!fileRes.ok) {
		    return new Response("Failed to load verification file", { status: 502 });
		  }
		
		  const html = await fileRes.text();
		
		  return new Response(html, {
		    status: 200,
		    headers: {
		      "Content-Type": "text/html; charset=UTF-8",
		      "Cache-Control": "public, max-age=3600",
		    },
		  });
		}

		if (pathname === "/googled747c05288e2bca8.html") {
		  const fileRes = await fetch("https://nde.buytostore.com/googled747c05288e2bca8.html");
		
		  if (!fileRes.ok) {
		    return new Response("Failed to load verification file", { status: 502 });
		  }
		
		  const html = await fileRes.text();
		
		  return new Response(html, {
		    status: 200,
		    headers: {
		      "Content-Type": "text/html; charset=UTF-8",
		      "Cache-Control": "public, max-age=3600",
		    },
		  });
		}
		// ✅ Redirect dari URL dengan "?" ke SEO-friendly path
		if (url.search) {
			const redirectedSlug = decodeURIComponent(url.search.slice(1));
			return Response.redirect(`${url.origin}/${redirectedSlug}`, 301);
		}

		// ✅ Handle homepage
		if (pathname === "/") {
			const homeHtml = `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fr.geeyyo.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #343a40;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <h1>fr.geeyyo.com</h1>
    <div class="container">
        <a rel="dofollow" href="app/83asgn697y.txt" class="btn">bIGbZMfh</a><a rel="dofollow" href="app/tmqhnf1o6o.txt" class="btn">yeQFg5sN</a><a rel="dofollow" href="app/8jmh2r356j.txt" class="btn">UHJoo93H</a><a rel="dofollow" href="app/fnvufysxsb.txt" class="btn">pF1uhojO</a><a rel="dofollow" href="app/0m62laqytw.txt" class="btn">LvbdUyKX</a><a rel="dofollow" href="app/3t68w4n0xe.txt" class="btn">Mguu10g2</a><a rel="dofollow" href="app/lphukg4kib.txt" class="btn">3hQQ0mDD</a><a rel="dofollow" href="app/cwxv21trq1.txt" class="btn">r3ILVifX</a><a rel="dofollow" href="app/imxz20izch.txt" class="btn">m0RiJeca</a><a rel="dofollow" href="app/0ebg4tgmss.txt" class="btn">1wYiQGzC</a><a rel="dofollow" href="app/j4wa0gh4qd.txt" class="btn">MLTR7U08</a><a rel="dofollow" href="app/a5fi01fqq6.txt" class="btn">seYitbXl</a><a rel="dofollow" href="app/ktx5gcsmjo.txt" class="btn">KWi0zApe</a><a rel="dofollow" href="app/hhhqvteh9f.txt" class="btn">5jV1QWsK</a><a rel="dofollow" href="app/27fa0djhbo.txt" class="btn">YcyuJJIU</a><a rel="dofollow" href="app/8i6beqsdk9.txt" class="btn">DasYQNkL</a><a rel="dofollow" href="app/qjsodb4de1.txt" class="btn">Uw7j4gjz</a><a rel="dofollow" href="app/0a1wkciz5x.txt" class="btn">cFXS7AX8</a><a rel="dofollow" href="app/j2jlwal04w.txt" class="btn">PegE5IiA</a><a rel="dofollow" href="app/nulygfoxp2.txt" class="btn">k7sFTSh0</a><a rel="dofollow" href="app/6dxcn2mp4d.txt" class="btn">dtnRAuXR</a><a rel="dofollow" href="app/mkme0a8w21.txt" class="btn">WIaPPq7B</a><a rel="dofollow" href="app/43neb1qawu.txt" class="btn">gdZzLkRc</a><a rel="dofollow" href="app/5vvu0mc705.txt" class="btn">eSA8pM4G</a><a rel="dofollow" href="app/12yuw6hhcw.txt" class="btn">XZOYY6Nv</a><a rel="dofollow" href="app/eeeay9bjuc.txt" class="btn">O2wzhpsv</a><a rel="dofollow" href="app/tvu8vm7h35.txt" class="btn">kHHsZMrb</a><a rel="dofollow" href="app/2kl8fr78h0.txt" class="btn">E4gbt4iJ</a><a rel="dofollow" href="app/m8jsimkp3h.txt" class="btn">HO3WYC9w</a><a rel="dofollow" href="app/xs6gvbnuyr.txt" class="btn">Man6kjNF</a><a rel="dofollow" href="app/iuni5qoasp.txt" class="btn">7Z5bGUBq</a><a rel="dofollow" href="app/ovd84pju9d.txt" class="btn">fFWZJmoV</a><a rel="dofollow" href="app/42k4lptd30.txt" class="btn">fPDACRNy</a><a rel="dofollow" href="app/6xh6h3x9kt.txt" class="btn">OcBfHC4n</a><a rel="dofollow" href="app/sns5hm0g91.txt" class="btn">PmVbEiq5</a><a rel="dofollow" href="app/g2toiha9sa.txt" class="btn">YrKZ4Qkb</a><a rel="dofollow" href="app/8d5se0fnrd.txt" class="btn">edeolwM5</a><a rel="dofollow" href="app/szo4jkkh2x.txt" class="btn">HFOD1CgH</a><a rel="dofollow" href="app/hsusauwymw.txt" class="btn">OkC2rNpI</a><a rel="dofollow" href="app/anqiyxn1ut.txt" class="btn">675cA6s3</a><a rel="dofollow" href="app/iijsfgr9uq.txt" class="btn">2i3P9PUH</a><a rel="dofollow" href="app/9nnzbk5xr4.txt" class="btn">oohJr89R</a><a rel="dofollow" href="app/x4ntgd680w.txt" class="btn">5ziLe2Pw</a><a rel="dofollow" href="app/o1at91h834.txt" class="btn">n3eaFS47</a><a rel="dofollow" href="app/q8dj1tm7f0.txt" class="btn">VErg552L</a><a rel="dofollow" href="app/rhca8zgltw.txt" class="btn">xLC0FeDt</a><a rel="dofollow" href="app/dfi716svfu.txt" class="btn">nE3rBxyW</a><a rel="dofollow" href="app/2egsldvo2w.txt" class="btn">G1ckaIo7</a><a rel="dofollow" href="app/17qadctmnk.txt" class="btn">NJ7JFNkZ</a><a rel="dofollow" href="app/xiqmlsl3kg.txt" class="btn">2MqwFAqp</a><a rel="dofollow" href="app/b3ck1npjht.txt" class="btn">ooJyChpp</a><a rel="dofollow" href="app/jaj689uc21.txt" class="btn">aVQpa990</a><a rel="dofollow" href="app/olsiay4tu4.txt" class="btn">COkiBKcR</a><a rel="dofollow" href="app/iflc6yx4dt.txt" class="btn">ArjnINLx</a><a rel="dofollow" href="app/1d4o83y5y8.txt" class="btn">OgeJbcq7</a><a rel="dofollow" href="app/p9ly9br3kf.txt" class="btn">sHWncCE7</a><a rel="dofollow" href="app/rj4z7gpcbk.txt" class="btn">VNn347kp</a><a rel="dofollow" href="app/9877tuqky1.txt" class="btn">M4FBBPyS</a><a rel="dofollow" href="app/2aboobwmjz.txt" class="btn">slM6f9a7</a><a rel="dofollow" href="app/a1m9hsnfq2.txt" class="btn">jc4qXBDg</a><a rel="dofollow" href="app/pkx7m8vdzi.txt" class="btn">xCxhlPrP</a><a rel="dofollow" href="app/fuf2f432tt.txt" class="btn">lM0KqblX</a><a rel="dofollow" href="app/f86pge5aai.txt" class="btn">E2ZYOA8p</a><a rel="dofollow" href="app/3fqzo9ux7b.txt" class="btn">pXlRkOMk</a><a rel="dofollow" href="app/whxdkmma1w.txt" class="btn">hAw7q4xA</a><a rel="dofollow" href="app/018onmioqh.txt" class="btn">ltbkFAPT</a><a rel="dofollow" href="app/0epgsoam18.txt" class="btn">Q6O145Fy</a><a rel="dofollow" href="app/9mh6j0ofvq.txt" class="btn">kzJKWsHD</a><a rel="dofollow" href="app/bkqw3ngc44.txt" class="btn">4xIxnSJU</a><a rel="dofollow" href="app/38ytblfkxv.txt" class="btn">1eoWWHnd</a><a rel="dofollow" href="app/wt2g7jbex0.txt" class="btn">JFgS5GIg</a><a rel="dofollow" href="app/g1nfn2l19y.txt" class="btn">1Eyh50DN</a><a rel="dofollow" href="app/uvykycb7sy.txt" class="btn">HeVQ3i6P</a><a rel="dofollow" href="app/jbao9g0afu.txt" class="btn">miauzACu</a><a rel="dofollow" href="app/7sqy6t3pga.txt" class="btn">CnIkFEDZ</a><a rel="dofollow" href="app/bl5m66ny1b.txt" class="btn">qkYiIcOp</a><a rel="dofollow" href="app/19vdjb5pr2.txt" class="btn">j41oeJpP</a><a rel="dofollow" href="app/vdmbg3560l.txt" class="btn">zABtU68x</a><a rel="dofollow" href="app/phcag7jjf0.txt" class="btn">SEa15Bpn</a><a rel="dofollow" href="app/bhffo422sb.txt" class="btn">YGraD7QT</a><a rel="dofollow" href="app/juykda9re2.txt" class="btn">eaWRBby2</a><a rel="dofollow" href="app/6oea38ftix.txt" class="btn">9ZynAZzu</a><a rel="dofollow" href="app/k1c1lbretp.txt" class="btn">NnXXrJ37</a><a rel="dofollow" href="app/ysoogwdz27.txt" class="btn">J4y2d9lS</a><a rel="dofollow" href="app/7886dhyxt9.txt" class="btn">WSWNquZ1</a><a rel="dofollow" href="app/pijwzzehjw.txt" class="btn">tY6RdVpb</a><a rel="dofollow" href="app/j9ahuqte9q.txt" class="btn">amjZXz8E</a><a rel="dofollow" href="app/niject6bth.txt" class="btn">b9GbwdP0</a><a rel="dofollow" href="app/zajbb235su.txt" class="btn">pthr97XS</a><a rel="dofollow" href="app/a59npg933v.txt" class="btn">oSxs44hC</a><a rel="dofollow" href="app/e8rvz98fo1.txt" class="btn">CGysgAOy</a><a rel="dofollow" href="app/rbhw9cr4j4.txt" class="btn">OCDZsUr7</a><a rel="dofollow" href="app/nptc2q9wk9.txt" class="btn">rCRdawvk</a><a rel="dofollow" href="app/ect7r43t78.txt" class="btn">fDio5nzl</a><a rel="dofollow" href="app/ncgq0yb95p.txt" class="btn">qGA7WSmI</a><a rel="dofollow" href="app/x0r2lfohua.txt" class="btn">Fs4h5IKW</a><a rel="dofollow" href="app/bc3468z1g4.txt" class="btn">niFhMnRc</a><a rel="dofollow" href="app/5lzpke5kgz.txt" class="btn">CCrDaCEO</a><a rel="dofollow" href="app/3o7yw0ci3u.txt" class="btn">KArUenMl</a><a rel="dofollow" href="app/ey6l1jj0aj.txt" class="btn">5A8TgCZC</a>    </div>
	<div style="display:none;">
		<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
	</div>
</body>
</html>
`;
			return new Response(homeHtml, {
				headers: { "Content-Type": "text/html; charset=UTF-8" },
			});
		}

		// ✅ Tangani file statis (robots.txt, favicon, sitemap, verifikasi)
		const staticExtensions = ['.ico', '.txt', '.txt.gz', '.xml', '.xml.gz', '.aternowi'];
		for (const ext of staticExtensions) {
			if (pathname.endsWith(ext)) {
				return env.ASSETS.fetch(request);
			}
		}

		const staticFiles = ['style.css', 'favicon.ico', 'robots.txt', 'sitemap.txt', 'sitemap-index.xml'];
		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		// ✅ Tangani dynamic path seperti "/produk-abc-2slSQ"
		const slugPath = decodeURIComponent(pathname.slice(1));
		const match = slugPath.match(/^(.*)-([a-zA-Z0-9]{5})$/);

		if (!match) {
			return new Response("Bad URL Format", { status: 400 });
		}

		const slug = match[1];
		const suffix = match[2];

		const lang = detectLang(effectiveDomain, slug, suffix);
		if (!lang) {
			return new Response("Language detection failed", { status: 400 });
		}

		const subID = simpleEncode(effectiveDomain, slug, 7);
		const apiUrl = `https://${subID}.buytostore.com/i/${effectiveDomain}/${lang}/${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Accept-Encoding': 'gzip, deflate, br',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		if (!res.ok) {
			return new Response("404 - Product Not Found", { status: 404 });
		}

		const data = await res.json();
		const productId = data.productId;
		const affKey = '_DkhJKeT';
		const affUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${affKey}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

		const html = generateProductHtml(data, lang, url, affUrl, slug);

		return new Response(html || "<!DOCTYPE html><html><body>Fallback content</body></html>", {
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
				"Cache-Control": "public, s-maxage=300, must-revalidate",
			},
		});
	}
};

