(function(window,undefined){

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        var Hash = History.getHash();
        console.log(State);
        console.log(Hash);
    });

})(window);