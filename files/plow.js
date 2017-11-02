
; (function (p, l, o, w, i, n, g) {
    if (!p[i]) {
        p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
        p.GlobalSnowplowNamespace.push(i); p[i] = function () {
            (p[i].q = p[i].q || []).push(arguments)
        }; p[i].q = p[i].q || []; n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1;
        n.src = w; g.parentNode.insertBefore(n, g)
    }
}(window, document, "script", "//d36l68au7j9bjn.cloudfront.net/2.4.3/sp.js", "snowplow"));

var plow = function (env, url) {

    var envid = env;

    // initialise tracker
    window.snowplow('newTracker', "cf", "blizzard.autotorq.com", {
        appId: "cfws",
        platform: 'web'
    });

    window.snowplow('enableActivityTracking', 30, 30); // ping every 30 seconds after 30 seconds
    window.snowplow('enableLinkClickTracking');
    window.snowplow('setCustomUrl', url);

    // contexts array
    var contexts = contexts || [];

    function Context(schema, data) {
        this.schema = schema;
        this.data = data;
    }

    function Event(schema, data) {
        this.schema = schema;
        this.data = data;
    }

    Context.prototype = {
        constructor: Context,
    }

    this.createContext = function (p) {

        this.createEnvContext();

        if (p.wid != null) {
            this.createWebsiteContext(p.wid, p.wtype, p.lang);
        }

        if (p.pid != null) {
            this.createPageContext(p.pid, p.ppid, p.pname);
        }

        if (p.uid != null) {
            this.createVehicleContext(p.unew, p.uid, p.udid, p.utype, p.uoid, p.uoname, p.umid, p.umname, p.uvid, p.uvname, p.uprice, p.ucurr, p.map, p.umy, p.umcount);
        }

        if (p.did != null) {
            this.createDealerContext(p.did, p.dname);
        }

        if (p.gid != null) {
            this.createGroupContext(p.gid, p.gname);
        }

        if (p.srid != null) {
            this.createSalesRegionContext(p.srid, p.srname);
        }

        if (p.mid != null) {
            this.createMarketContext(p.mid, p.mname);
        }

        if (p.oid != null) {
            this.createOEMContext(p.oid, p.oname);
        }

    };

    this.createEnvContext = function () {
        var schema = "iglu:com.autotorq.blizzard/environment_context/jsonschema/1-0-0";
        var data = { environment: envid };
        var envContext = new Context(schema, data);

        contexts.push(envContext);
    };

    this.createDealerContext = function (did, dname) {
        var schema = "iglu:com.autotorq.blizzard/dealer_context/jsonschema/1-0-0";
        var data = { dealer_id: did, dealer_name: dname };
        var dealerContext = new Context(schema, data);

        contexts.push(dealerContext);
    }

    this.createGroupContext = function (gid, gname) {
        var schema = "iglu:com.autotorq.blizzard/group_context/jsonschema/1-0-0";
        var data = { group_id: gid, group_name: gname };
        var groupContext = new Context(schema, data);

        contexts.push(groupContext);
    }

    this.createSalesRegionContext = function (srid, srname) {
        var schema = "iglu:com.autotorq.blizzard/salesregion_context/jsonschema/1-0-0";
        var data = { salesregion_id: srid, salesregion_name: srname };
        var salesRegionContext = new Context(schema, data);

        contexts.push(salesRegionContext);
    }

    this.createMarketContext = function (mid, mname) {
        var schema = "iglu:com.autotorq.blizzard/market_context/jsonschema/1-0-0";
        var data = { market_id: mid, market_name: mname };
        var marketContext = new Context(schema, data);

        contexts.push(marketContext);
    }

    this.createOEMContext = function (oid, oname) {
        var schema = "iglu:com.autotorq.blizzard/oem_context/jsonschema/1-0-0";
        var data = { oem_id: oid, oem_name: oname };
        var oemContext = new Context(schema, data);

        contexts.push(oemContext);
    }

    this.createWebsiteContext = function (wid, wtype, lang) {

        var schema = "iglu:com.autotorq.blizzard/website_context/jsonschema/1-0-0";
        var data = { website_id: wid, website_type: wtype, website_language: lang };
        var websiteContext = new Context(schema, data);

        contexts.push(websiteContext);
    };

    this.createPageContext = function (pid, ppid, pname) {

        var schema = "iglu:com.autotorq.blizzard/page_context/jsonschema/1-0-0";
        var data = { page_id: pid, parent_id: ppid, page_name: pname };
        var pageContext = new Context(schema, data);

        contexts.push(pageContext);
    };

    this.createVehicleContext = function (unew, uid, udid, utype, uoid, uoname, umid, umname, uvid, uvname, uprice, ucurr, map, umy, umcount) {

        var schema = "iglu:com.autotorq.blizzard/vehicle_context/jsonschema/1-0-0";
        var data = { is_new: unew, vehicle_id: uid, dealer_id: udid, type_id: utype, oem_id: uoid, oem_name: uoname, model_id: umid, model_name: umname, variant_id: uvid, variant_name: uvname, model_year: umy, price: uprice, currency: ucurr, ma_price: map, image_count: umcount };
        var vehicleContext = new Context(schema, data);

        contexts.push(vehicleContext);
    };

    this.createSearchEvent = function (s) {

        var schema = "iglu:com.autotorq.blizzard/vehiclesearch_event/jsonschema/1-0-0";
        var data = { search_id: s.id, search_type: s.type, makes: s.oemid, models: s.modelids, postcode: s.pcode, latitude: s.lat, longitude: s.long, distance: s.distance, colours: s.colour, body_styles: s.body, dealer_id: s.dealer, currency: s.curr, fuel_type: s.fuelids, min_price: s.pricefrom, max_price: s.priceto, min_mileage: s.mileagefrom, max_mileage: s.mileageto, transmission: s.transmissions, min_age: s.agefrom, max_age: s.ageto, min_engine: s.enginefrom, max_engine: s.engineto, options: s.options, approved_only: s.approved, total_results: s.totalresults, page_size: s.pagesize, page_number: s.pagenumber, sort_type: s.sort, search_mode: "interactive" };
        var searchEvent = new Event(schema, data);

        this.trackUnstructuredEvent(searchEvent);

        if (typeof imps !== 'undefined') {
            if (imps.length > 0) {
                for (var i = 0; i < imps.length; i++) {
                    this.createSearchImpressionEvent(imps[i]);
                }
            }
        }
    }

    this.createSearchImpressionEvent = function (i) {

        var schema = "iglu:com.autotorq.blizzard/vehiclesearchimpression_event/jsonschema/1-0-0";
        var data = { search_id: i.sid, usedvehicle_id: i.vid, dealer_id: i.did, position: i.pos };
        var impressionEvent = new Event(schema, data);

        this.trackUnstructuredEvent(impressionEvent);
    }


    this.trackPageView = function () {
        if (contexts.length > 0) {
            window.snowplow('trackPageView', false, contexts);
        }
        else {
            window.snowplow('trackPageView', false, null);
        }
    }
 
    this.trackEvent = function (c, a, l, p, v) {
        if (contexts.length > 0) {
            window.snowplow('trackStructEvent', c, a, l, p, v, contexts);
        }
        else {
            window.snowplow('trackStructEvent', c, a, l, p, v);
        }
    }

    this.trackUnstructuredEvent = function (event) {
        if (contexts.length > 0) {
            window.snowplow('trackUnstructEvent', event, contexts);
        }
        else {
            window.snowplow('trackUnstructEvent', event);
        }
    }

}