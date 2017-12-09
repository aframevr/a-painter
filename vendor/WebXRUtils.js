THREE.WebXRUtils = {
  getDisplays: () =>
    new Promise((resolve, reject) => {
      if (!navigator.XR) {
        console.log('WebXR polyfill is not found');
        resolve(null);
      } else {
        navigator.XR
          .getDisplays()
          .then(displays => {
            if (displays.length === 0) {
              console.log('No displays are available');
              resolve(null);
              return;
            }

            var ARParamers = {
              exclusive: false,
              type: XRSession.AUGMENTATION
            };
            var VRParamers = {
              exclusive: true,
              type: XRSession.REALITY
            };

            var realities = {
              vr: false,
              ar: false
            };
            for (var displayObj of displays) {
              // Reinit realities
              realities = {
                vr: false,
                ar: false
              };
              if (displayObj.supportsSession(ARParamers)) {
                if (
                  !displayObj._reality._vrDisplay &&
                  isMobileDevice() &&
                  !isAppleWebView()
                ) {
                  // Mobile browsers except WebARonARCore and iOS App XR app
                  realities.ar = false;
                } else if (!isMobileDevice()) {
                  // Desktop browsers
                  realities.ar = false;
                } else {
                  realities.ar = true;
                }
              }
              if (
                displayObj.supportsSession(VRParamers) &&
                displayObj._displayName.indexOf('polyfill') === -1
              ) {
                realities.vr = true;
              }
              displayObj.supportedRealities = realities;
            }
            resolve(displays);

            function isAppleWebView () {
              return (
                navigator.userAgent.indexOf('AppleWebKit') &&
                navigator.userAgent.indexOf('Safari') === -1
              );
            }

            function isMobileDevice () {
              return (
                typeof window.orientation !== 'undefined' ||
                navigator.userAgent.indexOf('IEMobile') !== -1
              );
            }
          })
          .catch(err => {
            console.error('Error getting XR displays', err);
            resolve(null);
          });
      }
    })
};
