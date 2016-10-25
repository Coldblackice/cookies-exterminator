let EXPORTED_SYMBOLS = ["Tabs"];

let Tabs = function(Cleaner, Buttons, Utils) {
	this.onClose = function(event) {
		let domain = Utils.getHostFromTab(event.target);
		if (domain) {
			Cleaner.prepare();
		}
	};

	this.onTabProgress = {	
		onLocationChange: function(aBrowser, aWebProgress, aRequest, aURI, aFlag) {
			if (aFlag & Components.interfaces.nsIWebProgress.LOCATION_CHANGE_SAME_DOCUMENT) {
				return;
			}
			try {
				let domain = aURI.host;
				if (domain) {
					let previousDomain = aBrowser.previousDomain;
					if (previousDomain && previousDomain != domain) {
						Cleaner.prepare();
					}
					aBrowser["previousDomain"] = domain;
				}
			} catch(e) {}
		}
	};

	this.onProgress = {
		onLocationChange: function(aWebProgress, aRequest, aLocation, aFlag) {
			if (aFlag & Components.interfaces.nsIWebProgress.LOCATION_CHANGE_SAME_DOCUMENT) {
				return;
			}
			try {
				Buttons.refresh();
			} catch(e) {}
		}
	};

	this.init = function(window) {
		let tabBrowser = window.gBrowser;
		tabBrowser.tabContainer.addEventListener("TabClose", this.onClose, false);
		tabBrowser.addTabsProgressListener(this.onTabProgress);
		tabBrowser.addProgressListener(this.onProgress);
	};

	this.clear = function(window) {
		let tabBrowser = window.gBrowser;
		tabBrowser.tabContainer.removeEventListener("TabClose", this.onClose, false);
		tabBrowser.removeTabsProgressListener(this.onTabProgress);
		tabBrowser.removeProgressListener(this.onProgress);
	};
};
