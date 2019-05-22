angular.module('connectAr', [])
  .controller('ConnectARController', function ConnectARController($rootScope) {
    // Authenticate to server.
    //lonOnToServer();

    // Scope properties
    this.qty = 5;
    this.markerList = getMarkers(2)
    console.log("markerList", this.markerList);
    
    function getMarkers(range){
      let marker;
      let markerList = [];
      for(let i = 0; i < range; i++){
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
                fetchOrderAndDisplayContent(markerId);
        });
        
        marker.addEventListener('markerLost', function() {
          var markerId = marker.id;
          console.log('markerLost', markerId);
        });
      }
    });

    function fetchOrderAndDisplayContent(id){
      var markerElement = document.getElementById(id);
      console.log(markerElement);
      getOrder(id).then(order => {
        if(markerElement){
          // var orgLogo = getImageObject('0 2.6 1', 'app/assets/images/Roche.png');
          // var orderId = getInfoObject('0 2 1', 'Order Id', order[0].orderId);
          // var orderStatus = getInfoObject('0 1.9 1', 'Process step name', order[0].processStepName);
          // var sampleType = getInfoObject('0 1.8 1', 'Sample Type', order[0].sampleType);
          // var box = getBoxObject('0 1 1', order[0].runStatus);

          //var orgLogo = getImageObject('0 2.6 0', 'app/assets/images/Roche.png');
          var orderId = getInfoObject('1 1 0', 'Order Id', order[0].orderId);
          // var orderStatus = getInfoObject('0 1.9 0', 'Process step name', order[0].processStepName);
          // var sampleType = getInfoObject('0 1.8 0', 'Sample Type', order[0].sampleType);
          // var box = getBoxObject('0 1 0', order[0].runStatus);

          //markerElement.appendChild(orgLogo);
          markerElement.appendChild(orderId);
          // markerElement.appendChild(orderStatus);
          // markerElement.appendChild(sampleType);
          // markerElement.appendChild(box);
        }
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
      image.setAttribute('position', position);
      image.setAttribute('src', imageUrl);  
      return image;
    }

    function getInfoObject(position, attribute, value){
      var entity = document.createElement('a-entity');
      entity.setAttribute('position', position);
      entity.setAttribute('text', `font: mozillavr; value: ${attribute}: ${value}; width: 4`);
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
});