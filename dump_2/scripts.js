const layout=g("layout"),menu=g("menu"),menuLink=g("menuLink"),content=g("main"),menuItems=[{name:"dashboard",title:"Dashboard",icon:"&#xEA02;",selected:!0},{name:"wifi",title:"WIFI",icon:"&#xEA0F;"},{name:"mqtt",title:"MQTT",icon:"&#xEA03;"},{name:"sensors",title:"Sensors",icon:"&#xEA01;"},{name:"httpd",title:"HTTPD",icon:"&#xEA93;"},{name:"firmware",title:"Firmware",icon:"&#xEA08;"},{name:"about",title:"About",icon:"&#xEA06;"}];function renderMenu(){$("#left-menu").empty(),menuItems.forEach(t=>{const e=$("<li></li>").addClass("pure-menu-item menu-item-divided").attr("id","menu-"+t.name).appendTo("#left-menu"),a=$("<a></a>").addClass("pure-menu-link").attr("href","#").on("click",()=>activeContent(t)).appendTo(e);$("<i></i>").addClass("material-icons").append(t.icon).appendTo(a),$("<span></span>").append(t.title).appendTo(a);t.selected?(e.addClass("pure-menu-selected"),$("#"+t.name).show()):$("#"+t.name).hide()})}function activeContent(t){menuItems.forEach(e=>e.selected=t.name===e.name),menuToogle(),renderMenu()}function g(t){return document.getElementById(t)}function passView(t){g(t).type="password"===g(t).type?"text":"password"}function mqtt_change(){$("#mqtt_url").val(`${$("#mqtt_type").val()}://${$("#mqtt_username").val()}:${$("#mqtt_password").val()}@${$("#mqtt_hostname").val()}:${$("#mqtt_port").val()}`)}function changeWifiMode(){"static"===g("wifi_mode").value?g("staticip").style.display="block":g("staticip").style.display="none"}function setRelay(t,e){e?(g("td-port"+t).classList.remove("off"),g("lb-port"+t).innerText="ON"):(g("td-port"+t).classList.add("off"),g("lb-port"+t).innerText="OFF")}function toogleRelay(t){g("td-port"+t).classList.contains("off")?sendSetRelay(t,!0):sendSetRelay(t,!1)}function sendSetRelay(t,e){g("loading").style.display="block",fetch(`/action?name=relay&id=${t}&status=${e?"ON":"OFF"}`).then(t=>t.json()).then(()=>{g("loading").style.display="none",setRelay(t,e)}).catch(()=>{g("loading").style.display="none",alert("Error changing relay status.")})}function updateFirmware(){g("loading").style.display="block",fetch("/action?name=firmware&url="+g("firmware_url").value).then(t=>t.json()).then(()=>{g("loading").style.display="none"}).catch(()=>{g("loading").style.display="none",alert("Error uploading new firmware.")})}function restartBoard(){g("loading").style.display="block",fetch("/action?name=restart").then(t=>t.json()).then(()=>{g("loading").style.display="none",alert("Board Restarted!")}).catch(()=>{g("loading").style.display="none",alert("Error restarting board.")})}function saveBoard(){g("loading").style.display="block",fetch("/save",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({wifi:{ap_password:$("#wifi_ap_password").val(),sta_ssid:$("#wifi_sta_ssid").val(),sta_password:$("#wifi_sta_password").val(),dhcp:"dhcp"===$("#wifi_dhcp").val(),ip:$("#wifi_ip").val(),netmask:$("#wifi_netmask").val(),gateway:$("#wifi_gateway").val(),dns1:$("#wifi_dns1").val(),dns2:$("#wifi_dns2").val()},mqtt:{url:$("#mqtt_url").val(),topic:$("#mqtt_topic").val(),enable:$("#mqtt_enable").prop("checked")},httpd:{username:$("#httpd_username").val(),password:$("#httpd_password").val(),token:$("#httpd_token").val(),api_enable:$("#httpd_api_enable").prop("checked")},relay:[!g("td-port1").classList.contains("off"),!g("td-port2").classList.contains("off"),!g("td-port3").classList.contains("off")]})}).then(t=>t.json()).then(()=>{g("loading").style.display="none"}).catch(()=>{alert("Failed to save configurations on board"),g("loading").style.display="block"})}function loadConfig(){g("loading").style.display="block",Promise.all([fetch("/?file=config.json").then(t=>t.json()).then(t=>{const[e,a]=t.mqtt.url.split("://"),[n,i]=a.split("@"),[s,l]=n.split(":"),[o,d]=i.split(":");$("#wifi_ap_password").val(t.wifi.ap_password),$("#wifi_sta_ssid").val(t.wifi.sta_ssid),$("#wifi_sta_password").val(t.wifi.sta_password),$("#wifi_ip").val(t.wifi.ip),$("#wifi_netmask").val(t.wifi.netmask),$("#wifi_gateway").val(t.wifi.gateway),$("#wifi_dns1").val(t.wifi.dns1),$("#wifi_dns2").val(t.wifi.dns2),$("#wifi_dhcp").selectedIndex=t.wifi.dhcp?0:1,$("#mqtt_url").val(t.mqtt.url),$("#mqtt_type").val(e),$("#mqtt_username").val(s),$("#mqtt_password").val(l),$("#mqtt_hostname").val(o),$("#mqtt_port").val(d),$("#mqtt_enable").prop("checked",!0===t.mqtt.enable),$("#mqtt_topic").val(t.mqtt.topic),$("#httpd_username").val(t.httpd.username),$("#httpd_password").val(t.httpd.password),$("#httpd_api_enable").prop("checked",!0===t.httpd.api_enable),$("#httpd_token").val(t.httpd.token),mqtt_change()}),fetch("/status").then(t=>t.json()).then(t=>{g("s_board_model").innerText=t.board.model,g("s_board_hostname").innerText=t.board.hostname,g("s_board_build").innerText=t.board.build,g("s_board_uptime").innerText=t.board.uptime,g("s_wifi_mode").innerText=t.wifi.mode,g("s_wifi_status").innerText=t.wifi.status,g("s_wifi_ip").innerText=t.wifi.ip,g("s_wifi_netmask").innerText=t.wifi.netmask,g("s_wifi_gateway").innerText=t.wifi.gateway,g("s_mqtt_status").innerText=t.mqtt.status;const[e,a,n]=t.relay;setRelay(1,e),setRelay(2,a),setRelay(3,n)})]).then(()=>{g("loading").style.display="none"}).catch(()=>{g("loading").style.display="none",alert("Configuration was not loaded from board.")})}function toggleClass(t,e){const a=t.className.split(/\s+/),{length:n}=a;let i=0;for(;i<n;i+=1)if(a[i]===e){a.splice(i,1);break}n===a.length&&a.push(e),t.className=a.join(" ")}function toggleAll(t){t&&t.preventDefault(),toggleClass(layout,"active"),toggleClass(menu,"active"),toggleClass(menuLink,"active")}function menuToogle(t){-1!==menu.className.indexOf("active")&&toggleAll(t)}renderMenu(),loadConfig(),menuLink.onclick=function(t){toggleAll(t)},content.onclick=menuToogle;