    // Authenticate to server.
    //lonOnToServer();
    //checkAuth();
    main();

    // this.markerList = getMarkers(2)
    // console.log("markerList", this.markerList);
    
    function main(){
      $(document).ready(function(){
        let scene =  $('a-scene')[0];
        let markers = getMarkersFromRange(1000, 1012);
        markers.filter(mker => { 
          scene.append(getMarkerObject(mker.id));
        });
        //console.log("Scene", scene[0]);
        //getMarkerObject(1);
      });
    }

    function checkAuth(){
      if(isAuthenticated()){
        main();
      }else{
        window.location.href = "login.html";
      }
    }

    function isAuthenticated(){
      const appCookie = document.cookie;
      if(appCookie && appCookie !== ''){
        return true;
      }else{
        return false;
      }
    }

    function getMarkerObject(value){
      let marker = document.createElement('a-marker');
      marker.setAttribute("type", "barcode");
      marker.setAttribute("value", value);
      marker.setAttribute("id", value);
      marker.setAttribute("color", '#000000');
      //marker.setAttribute("registerevents");

      marker.addEventListener('markerFound', function() {
        console.log('markerFound', marker.id);
        //console.log("Marker", $(`#${marker.id}`));
        //fetchOrderAndDisplayContent(marker.id);
        displayPlane(marker.id);
      });

      return marker;
    }

    function getMarkers(range){
      let marker;
      let markerList = [];
      for(let i = 0; i < range; i++){
        marker = {id: i}
        markerList.push(marker);
      }
      return markerList;
    }

    function getMarkersFromRange(from, to){
      let marker;
      let markerList = [];
      for(let i = from; i < to + 1; i++){
        marker = {id: i}
        markerList.push(marker);
      }
      return markerList;
    }

    // To register the marker events
    AFRAME.registerComponent('registerevents', {
      init: function () {
        var marker = this.el;
        marker.addEventListener('markerFound', function() {
                var markerId = marker.id;
                console.log('markerFound', markerId);
                //fetchBoxImage(markerId);
                //fetchOrderAndDisplayContent(markerId);
        });
        
        marker.addEventListener('markerLost', function() {
          var markerId = marker.id;
          console.log('markerLost', markerId);
        });
      }
    });

    function displayPlane(id){
      var markerElement = document.getElementById(id);
      let plane = getPlane(id);

      var image1 = document.createElement('a-image');
      image1.setAttribute('position', '-0.16 0.35 0');
      image1.setAttribute('src', 'app/assets/images/Roche2.png'); 
      image1.setAttribute('height', '0.2'); 
      image1.setAttribute('width', '0.3'); 

      let entity1 = document.createElement('a-entity');
      entity1.setAttribute('position', '0.7 0.2 0');
      entity1.setAttribute('text', `font: mozillavr; value: 1002; width: 2; color: #000000`);
      
      let entity2 = document.createElement('a-entity');
      entity2.setAttribute('position', '0.7 0.05 0');
      entity2.setAttribute('text', `font: mozillavr; value: NIPT; width: 2; color: #000000`);

      let entity3 = document.createElement('a-entity');
      entity3.setAttribute('position', '0.45 -0.1 0');
      entity3.setAttribute('text', `font: mozillavr; value: LP Post PCR/Pooling; width: 1.5; color: #000000`);

      var image2 = document.createElement('a-image');
      image2.setAttribute('position', '-0.18 -0.35 0');
      image2.setAttribute('src', 'app/assets/images/completed.png'); 
      image2.setAttribute('height', '0.28'); 
      image2.setAttribute('width', '0.28'); 

      plane.appendChild(image1);
      plane.appendChild(entity1);
      plane.appendChild(entity2);
      plane.appendChild(entity3);
      plane.appendChild(image2);
    
      markerElement.appendChild(plane);
    }

    function getPlane(id){
      var plane = document.createElement('a-plane');
      plane.setAttribute('color', '#FFF');
      plane.setAttribute('height', '1');
      plane.setAttribute('width', '0.7');
      plane.setAttribute('rotation', '-90 0 0'); 
      return plane;
    }

    function fetchOrderAndDisplayContent(id){
      var markerElement = document.getElementById(id);
      console.log(markerElement);
      getOrder(id).then(order => {
        getProcessStepResults(id).then(processStepResults => {
          if(processStepResults){
            let latestProcessStepResult = processStepResults.sort(function(a,b) { 
              return new Date(b.runCompletionTime).getTime() - new Date(a.runCompletionTime).getTime() 
            })[0];

            //var orgLogo = getImageObject('-0.5 0.4 -1', 'app/assets/images/Roche.png');
            var orgLogo = getImageObject('-0.5 0.4 -1', 'app/assets/images/Roche.png');
            var accessioningId = getInfoObject('1 0.4 -0.2', '-90 0 0', 'Accessioning Id', latestProcessStepResult.accesssioningId);
            var assayType = getInfoObject('1 0.4 0', '-90 0 0', 'Assay type', order[0].assayType);
            var processStepName = getInfoObject('1 0.4 0.2', '-90 0 0', 'Process step name', latestProcessStepResult.processStepName);
            var status = getImageObject('-0.5 0.4 1', `app/assets/images/${latestProcessStepResult.runStatus.toLowerCase()}.png`);

            markerElement.appendChild(orgLogo);
            markerElement.appendChild(accessioningId);
            markerElement.appendChild(assayType);
            markerElement.appendChild(processStepName);
            markerElement.appendChild(status);
          }
        }, error => {});
      }, error => {});
    }

    function getBoxObject(position, status){
      var box = document.createElement('a-box');
      var status = status.toLowerCase().replace(' ', '_');
      box.setAttribute('position', position);
      box.setAttribute('src', `app/assets/images/${status}.png`);  
      return box;
    }

    function getImageObject(position, imageUrl){
      var image = document.createElement('a-image');
      image.setAttribute('rotation', '-90 0 0');
      image.setAttribute('position', position);
      image.setAttribute('src', imageUrl);  
      return image;
    }

    function getInfoObject(position, rotation, attribute, value){
      var entity = document.createElement('a-entity');
      entity.setAttribute('position', position);
      entity.setAttribute('rotation', rotation);
      entity.setAttribute('text', `font: mozillavr; value: ${attribute}: ${value}; width: 4; color: #000000`);
      return entity;
    }

    // Fetching the marker box image
    function fetchBoxImage(marketId){
      var id = `id${marketId}`;
      var ele = document.getElementById(id);
      var icon;
      var iconType = '.png';
  
      getOrder(marketId).then(order => {
        //updateText(marketId, order);

        if(ele){
          icon = order.status.toLowerCase().replace(' ', '_') + iconType;
          ele.setAttribute('src', `app/assets/images/${icon}`);
          console.log("ELE", ele.src);
        }
      }, error => {});
    }

    // To update the a-text object
    function updateText(id, foundObject){
      var textObject = document.getElementById(`text${id}`);
      if(textObject){
        textObject.setAttribute('text', `value: Order Id: ${foundObject.orderId}`);
      }
    }

    function lonOnToServer(requestBody){
      var requestBody;
      var formData = new FormData();
      formData.append('j_username', config.credential.userName);
      formData.append('j_password', config.credential.password);
      formData.append('org', config.credential.domain);
      requestBody = {method: 'post', body: formData};

      authenticate(requestBody).then(success => {
        console.log("Authentication success");
      }, error => {
        console.log("Authentication failed");
      });
    }
