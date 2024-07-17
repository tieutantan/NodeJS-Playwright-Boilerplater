# NodeJS-Playwright-Boilerplater
For Automation Tasks, Not Testing Only...

### Locations

    Hoan Kiem
    GEOLOCATION : {latitude: 21.0304, longitude: 105.8446},
    
    Binh Thanh
    GEOLOCATION : {latitude: 10.8121, longitude: 106.6971},
    
    New York
    GEOLOCATION : {latitude: 40.697, longitude: -74.144},
    
    Le Chan
    GEOLOCATION : {latitude: 20.8357, longitude: 106.66699},

### Debug Mouse Position
     await page.evaluate(() => {
        document.addEventListener('mousemove', (event) => {
            console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
        });
    });
    await page.pause();