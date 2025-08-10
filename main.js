// GreenBrew main JS: simple localStorage cart and add-to-cart animation
(function($){
  function getCart(){ try{ return JSON.parse(localStorage.getItem('gb_cart')||'[]'); }catch(e){ return []; } }
  function saveCart(c){ localStorage.setItem('gb_cart', JSON.stringify(c)); updateCount(); }
  function updateCount(){ var c = getCart(); var q = c.reduce((s,i)=>s+i.qty,0); $('#cart-count').text(q); $('#cart-count-2').text(q); }
  function addToCart(item, qty){
    var cart = getCart();
    var existing = cart.find(i=>i.id==item.id);
    if(existing) existing.qty += qty;
    else cart.push(Object.assign({},item,{qty:qty}));
    saveCart(cart);
  }

  $(function(){
    updateCount();
    // Add to cart button
    $('.add-to-cart').on('click', function(e){
      e.preventDefault();
      var $btn = $(this);
      var id = $btn.data('id');
      var name = $btn.data('name');
      var price = parseFloat($btn.data('price'));
      var qty = parseInt($('#qty').val()||1);
      // animation: clone image and fly to cart
      var img = $btn.closest('.card, body').find('img').first();
      if(img && img.length){
        var $fly = img.clone().css({position:'absolute', zIndex:999, width:img.width()}).appendTo('body');
        var off = img.offset();
        $fly.css({left:off.left, top:off.top});
        var cartPos = $('a[href="cart.html"]').offset() || {left:$(window).width()-50, top:20};
        $fly.animate({left:cartPos.left, top:cartPos.top, width:20, height:20, opacity:0.3}, 800, function(){ $fly.remove(); });
      }
      addToCart({id:id,name:name,price:price}, qty);
      // temporary feedback
      $btn.text('Added').prop('disabled', true);
      setTimeout(()=>{ $btn.text('Add to cart').prop('disabled', false); }, 900);
    });

    // Cart page rendering
    if($('#cart-contents').length){
      var cart = getCart();
      if(!cart.length){
        $('#cart-contents').html('<p>Your cart is empty.</p>');
        $('#cart-actions').html('<a href="index.html" class="btn btn-primary">Continue shopping</a>');
      } else {
        var html = '<table class="table"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>';
        var sum=0;
        cart.forEach(function(it){
          var total = it.qty * it.price; sum += total;
          html += `<tr><td>${it.name}</td><td>${it.qty}</td><td>$${it.price.toFixed(2)}</td><td>$${total.toFixed(2)}</td></tr>`;
        });
        html += `</tbody></table><p class="h5">Subtotal: $${sum.toFixed(2)}</p>`;
        $('#cart-contents').html(html);
        $('#cart-actions').html('<button class="btn btn-success" id="checkout">Proceed to checkout</button>');
        $('#checkout').on('click', function(){ alert('This is a demo. Checkout would be handled by WooCommerce on a real site.'); });
      }
    }
    // Keep counts updated on load
    updateCount();
  });

})(jQuery);
