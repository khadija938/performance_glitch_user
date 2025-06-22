const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Step 1: Go to login page
    await driver.get('https://www.saucedemo.com/');

    // Step 2: Login with performance_glitch_user
    await driver.findElement(By.id('user-name')).sendKeys('performance_glitch_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    // Step 3: Wait for inventory page to load
    await driver.wait(until.elementLocated(By.className('inventory_list')), 10000);

    // Step 4: Open menu and reset app state
    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.sleep(1000);
    await driver.findElement(By.id('reset_sidebar_link')).click();
    await driver.findElement(By.id('react-burger-cross-btn')).click();

    // Step 5: Sort products by Name (Z to A)
    let sortDropdown = await driver.findElement(By.className('product_sort_container'));
    await sortDropdown.sendKeys('Name (Z to A)');

    // Step 6: Add first item to cart
    await driver.sleep(1000);
    let firstItemName = await driver.findElement(By.css('.inventory_item:first-child .inventory_item_name')).getText();
    await driver.findElement(By.css('.inventory_item:first-child button')).click();

    // Step 7: Go to cart
    await driver.findElement(By.className('shopping_cart_link')).click();

    // Step 8: Proceed to checkout
    await driver.findElement(By.id('checkout')).click();
    await driver.findElement(By.id('first-name')).sendKeys('John');
    await driver.findElement(By.id('last-name')).sendKeys('Doe');
    await driver.findElement(By.id('postal-code')).sendKeys('12345');
    await driver.findElement(By.id('continue')).click();

    // Step 9: Verify product name and total
    let checkoutItemName = await driver.findElement(By.className('inventory_item_name')).getText();
    let itemTotal = await driver.findElement(By.className('summary_subtotal_label')).getText();
    let total = await driver.findElement(By.className('summary_total_label')).getText();

    console.log('Product Name:', checkoutItemName);
    console.log('Item Total:', itemTotal);
    console.log('Total:', total);

    // Step 10: Finish order
    await driver.findElement(By.id('finish')).click();

    // Step 11: Verify success message
    let successMsg = await driver.findElement(By.className('complete-header')).getText();
    if (successMsg === 'Thank you for your order!') {
      console.log('Order completed successfully.');
    } else {
      console.log('Order failed.');
    }

    // Step 12: Reset App State again
    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.sleep(1000);
    await driver.findElement(By.id('reset_sidebar_link')).click();
    await driver.findElement(By.id('react-burger-cross-btn')).click();

    // Step 13: Logout
    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.sleep(1000);
    await driver.findElement(By.id('logout_sidebar_link')).click();

    console.log('Logged out successfully.');

  } catch (error) {
    console.error('❗ Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();