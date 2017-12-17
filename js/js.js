
/**
 * Global component for category select use
 * Product List HERE
 */
Vue.component('category-select', {
    props: ['categories', 'selected', 'productList'],
    data: function(){
      return {
        selectedCategory: this.selected,
        url: '/Product/getProduct.php',
        productArr: []
      }
    },
    template: `
            <select v-model = 'selectedCategory' class = 'form-control lg' @change = 'change'>
              <option disabled value = ''> Please select category</option>
              <option v-for = 'option in categories' :value='option.ID'>
                {{ option.Name }}
              </option>
            </select>        
       `,
    methods: {
        /**
         * Get Product List on Category change
         */
        change: function(){
            var self = this;
            this.getProductList(this.selectedCategory, () => {
                // call props update force from child
                self.$emit('update:selected', this.selectedCategory);
                self.$emit('update:productList', this.productArr);
            });

        },
        getProductList: function(category, cb){
            let self = this;
            app.sendData(this.url, {CategoryID: this.selectedCategory}, (model, response) => {
                self.productArr = JSON.parse(response);
                if (cb) cb();
            });
        }
    }

});

/**
 * Global component for product select use
 */
Vue.component('product-select', {
    props: ['products', 'selected', 'parentIndex'],
    data: function(){
        return {
            selectedProduct: this.selected,
        }
    },
    template: `
            <select v-model = 'selectedProduct' class = 'form-control big' @change = 'change(this)'>
              <option disabled value = ''> Please select product</option>
              <option v-for = 'option in products' :value='option'>
                {{ option.Name }}
              </option>
            </select>        
       `,
    methods: {
        change: function(){
            // call props update force from child
            this.$emit('update:selected', this.selectedProduct);
            eventHub.$emit('product-has-been-chosen', this.parentIndex)
        }
    }
});

Vue.component('category-form', {
    template: `
        <form action="/Category/addCategory.php" method="Post">
          <h2> {{ title }} </h2>
          <div class="form-group row">
            <label for="categoryName" class="col-sm-2 col-form-label">Name</label>
            <div class="col-sm-10">
              <input type="text" class="form-control"
                     id="categoryName" name = 'Name'
                     placeholder="categoryName" v-model.trim = 'category'>
            </div>
          </div>
    
          <button type='button' v-if = '!id' class="btn btn-primary" @click = 'add'>Add </button>
          <button type='button' v-if = 'id' class="btn btn-warning" @click = 'edit'>Edit </button>
        </form>    
    `,
    data: function() {
        return {
            url: '/Category/addCategory.php',
            title: 'Add new category, component',
            category: '',
            id: ''
        };
    },

    created: function(){
        eventHub.$on('select-category-in-list', this.selectCategory);
    },

    beforeDestroy: function(){
        eventHub.$off('select-category-in-list', this.selectCategory);
    },

    methods: {
        add: function(){
            if (!this.category.length) return false;

            let data = {'Name': this.category};
            this.sendData(data, 'add-category');
        },

        edit: function(){
            let data = {'Name': this.category, 'ID': this.id};
            this.sendData(data, 'edit-category');
        },

        selectCategory: function(cat){
            this.category = cat.Name;
            this.id = cat.ID;
        },

        sendData: function(data, event){
            app.sendData(this.url, data, (model, response) => {
                this.id = response;
                eventHub.$emit(event, Object.assign(data, {ID: (+response || data.ID)}));
            });
        }
    }
});

Vue.component('category-list', {
    template: `
    <div>
        <h2> {{ title }} </h2>
        <ul id ='Categories' class = "list-group">
            <li v-for='(cat, index) in catArr' @click = 'selectCategory(cat)' 
                class = "list-group-item d-flex justify-content-between align-items-center">
                   {{ cat.ID }} {{ cat.Name }}
                   <span >
                       <button type = 'button' class = 'btn btn-danger btn-sm'
                       @click.stop="deleteCategory(cat, index)">X</button>
                   </span>
            </li>
        </ul>    
    </div>
    `,

    data: () => {
        return {
            url: '/Category/getCategories.php',
            catArr: [],
            title: 'Categories, component'
        }
    },

    created: function(){
        let self = this;
        this.fetchData('/Category/getCategories.php', (model, response) => {
            self.catArr = JSON.parse(response);
        });
        eventHub.$on('add-category', this.addCategoryInList);
        eventHub.$on('edit-category', this.editCategoryInList);
    },

    beforeDestroy: function(){
        eventHub.$off('add-category', this.addCategoryInList);
        eventHub.$off('edit-category', this.editCategoryInList);
    },

    methods: {
        fetchData: function (scr, callback) {
            let self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('Get', scr);
            xhr.send();
            xhr.onreadystatechange = function () { // (3)
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                } else {
                    callback(self, xhr.responseText);
                }
            }
        },

        sendData: function (scr, data, callback){
            let self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', scr);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(data);
            xhr.send(json);

            xhr.onreadystatechange = function() { // (3)
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                } else {
                    callback(self, xhr.responseText);
                }
            }
        },

        addCategoryInList: function(cat){
            this.catArr.push(cat);
        },

        editCategoryInList: function(cat){
            let modifiedIndex = this.catArr.findIndex((el)=>{return el.ID == cat.ID})
            this.catArr[modifiedIndex].Name = cat.Name;

        },

        deleteCategory: function(cat, index) {
            var self = this;
            this.sendData('/Category/removeCategory.php', cat, (model, response) => {
                self.catArr.splice(index, 1);
                console.log(response);
            })
        },

        selectCategory: function(cat){
            eventHub.$emit('select-category-in-list', cat);
        }
    }

})

Vue.component('product-form-global', {
    template: `
          <form method='post'>
            <h2> {{ title }} </h2>
            <div class="form-group row" v-for = 'field in fields' >
                <label :for="field.id" class="col-3 col-form-label">{{field.name}}</label>
                <div class="col-9">
                  <input type="text" :id = 'field.id'
                         class="form-control" :name = 'field.name'
                         :placeholder='field.name'
                         v-model = 'field.value'
                  >
                </div>
            </div>

            <div class="form-group row" >
              <label for="categorySelect" class="col-3 col-form-label">Category</label>
              <div class="col-9">
                <select v-model = 'selectedCategory' class = 'form-control' id = 'categorySelect'>
                  <option disabled value = ''> Please select category</option>
                  <option v-for = 'option in categories' :value='option'>
                    {{ option.Name }}
                  </option>
                </select>
                
              </div>
            </div>
            <button type='button' v-if = '!id'class="btn btn-primary" @click = 'addProduct'>Send </button>
            <button type='button' v-if = 'id' class="btn btn-warning" @click = 'edit'>Edit </button>
            <button type='button' class="btn btn-success" @click = 'clear'>Clear </button>
          </form>        
        `,

    data: () => {
        return {
            createUrl: '/Product/addProduct.php',
            editUrl:  '/Product/updateProduct.php',
            title: 'Add new product, component',
            categories: [],
            selectedCategory: '',
            id: '',
            fields: [
                {name: 'Name', id: 'productName', value: ''},
                {name: 'Protein', id: 'productProtein', value: ''},
                {name: 'Fat', id: 'productFat', value: ''},
                {name: 'Carbo', id: 'productCarbo', value: ''},
                {name: 'Amount', id: 'productAmount', value: ''}
            ]
        }
    },

    created: function(){
        let self = this;
        this.fetchData('/Category/getCategories.php', (model, response) => {
            self.categories = JSON.parse(response);
        });

        eventHub.$on('select-product-in-list', this.selectProduct);
    },

    beforeDestroy: function(){
        eventHub.$off('select-product-in-list', this.selectProduct);
    },
    methods: {
        fetchData: function (scr, callback) {
            let self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('Get', scr);
            xhr.send();
            xhr.onreadystatechange = function () { // (3)
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                } else {
                    callback(self, xhr.responseText);
                }
            }
        },

        sendData: function (scr, data, callback) {
            let self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', scr);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(data);
            xhr.send(json);

            xhr.onreadystatechange = function () { // (3)
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                } else {
                    callback(self, xhr.responseText);
                }
            }
        },

        addProduct: function() {
            let data = this.getDataFromFields();

            this.sendData(this.createUrl, data, (model, response) => {
                this.id = response;
                eventHub.$emit('add-product', Object.assign(data, {ID: (+response || data.ID)}));
            })
        },

        edit: function(){
            let data = this.getDataFromFields();

            this.sendData(this.editUrl, data, (model, response) => {
                eventHub.$emit('edit-product', Object.assign(data, {ID: data.ID}));
            })
        },

        clear: function(){
            this.selectedCategory = '';
            this.id = '';
            this.fields.forEach((el)=>{
                el.value = '';
            })

        },

        getDataFromFields: function(){
            let data = {};

            for (let i = 0; i < this.fields.length; i++){
                data[this.fields[i].name] = this.fields[i].value;
            }

            Object.assign(
                data,
                {CategoryID: this.selectedCategory.ID, CategoryName: this.selectedCategory.Name},
                {ID: this.id}
            );

            return data;
        },

        selectProduct: function(item, selectedCtegory, id){
            this.selectedCategory = selectedCtegory;
            this.fields = item;
            this.id = id;
        }
    }
});
Vue.component('product-list', {
    template: `
          <div>
          <h2> {{ title }} </h2>
          <ul class = 'list-group'>
            <li v-for='(item, index) in sortedProductArr' @click = 'selectProduct(item)'
                class = "list-group-item d-flex justify-content-between align-items-center"
            >
              {{ item.CategoryName ? item.CategoryName + ' :' : '' }} {{ item.ID }} - {{item.Name }}
              <span>
                  <button type = 'button' class = 'btn btn-danger btn-sm'
                          @click.stop="deleteProduct(item, index)">X</button>
              </span>
            </li>
          </ul>
         </div>
        `,
        data: () => {
        return {
            url: '/Product/getProducts.php',
            productArr: [],
            title: 'Products component'
        }
    },

    computed:{
        sortedProductArr: function (){
            return _.orderBy(this.productArr, 'CategoryID')
        }
    },

    created: function (){
        let self = this;
        this.fetchData(this.url, (model, response) => {
            self.productArr = JSON.parse(response);
        });

        eventHub.$on('add-product', this.addProductInList);
        eventHub.$on('edit-product', this.editProductInList);
    },

    beforeDestroy: function(){
        eventHub.$off('add-product', this.addProductInList);
        eventHub.$off('edit-product', this.editProductInList);
    },
    methods: {
        fetchData: function (scr, callback) {
            let self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('Get', scr);
            xhr.send();
            xhr.onreadystatechange = function () { // (3)
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                } else {
                    callback(self, xhr.responseText);
                }
            }
        },

        sendData: function (scr, data, callback) {
            let self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', scr);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(data);
            xhr.send(json);

            xhr.onreadystatechange = function () { // (3)
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                } else {
                    callback(self, xhr.responseText);
                }
            }
        },

        deleteProduct: function(item, index) {
            var self = this;
            this.sendData('/Product/removeProduct.php', item, (model, response) => {
                self.productArr.splice(index, 1);
                console.log(response);
            })
        },

        selectProduct: function(item){
            let allowed = ['Name', 'Protein', 'Fat', 'Carbo', 'Amount']
            let arr = [];
            for (let key in item){
                if (allowed.indexOf(key) > -1) {
                    arr.push({name: key, id: `product${key}`, value: item[key]});
                }
            };

            let selectedCategory = {ID: item.CategoryID, Name: item.CategoryName};
            eventHub.$emit('select-product-in-list', arr, selectedCategory, item.ID);
        },

        addProductInList: function(item){
            this.productArr.push(item);
        },

        editProductInList: function(item){
            let modifiedIndex = this.productArr.findIndex((el)=>{return el.ID == item.ID})
            let el = this.productArr[modifiedIndex]

            for (key in el){
                if (el[key]  !== undefined) {
                    console.log(key);
                    el[key] = item[key];
                }
            }
        }

    }
});

var eventHub = new Vue();

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },

  methods: {
      /**
       * Send's json data with Post
        * @param scr - url
       * @param data - object
       * @param callback - success
       */
     sendData: function (scr, data, callback){
         let self = this;
         var xhr = new XMLHttpRequest();
         xhr.open('POST', scr);
         xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
         let json = JSON.stringify(data);
         xhr.send(json);

         xhr.onreadystatechange = function() { // (3)
             if (xhr.readyState != 4) return;

             if (xhr.status != 200) {
                 alert(xhr.status + ': ' + xhr.statusText);
             } else {
                 callback(self, xhr.responseText);
             }
         }
     }
  },
  
  components: {
       /**
       * Calculator component
       */
    'meal-calc' :{
        data: function (){
            return {
                mealArr: new Array({
                    CategoryID: '',
                    Product: '',
                    ProductList: [],
                    Calories: 0
                }),
                catArr: []
            };
        },

        created: function(){
            let self = this;
            this.fetchData('/Category/getCategories.php', (model, response) => {
                self.catArr = JSON.parse(response);
            });
            eventHub.$on('product-has-been-chosen', this.amountChange);
        },

        beforeDestroy: function(){
            eventHub.$off('product-has-been-chosen', this.amountChange);
        },

        methods: {
            /**
             * simple fetch data from server, no innups
             * @param scr - url
             * @param callback - success
             */
            fetchData: function(scr, callback){
                let self = this;
                var xhr = new XMLHttpRequest();
                xhr.open('Get', scr);
                xhr.send();
                xhr.onreadystatechange = function() { // (3)
                    if (xhr.readyState != 4) return;

                    if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText);
                    } else {
                        callback(self, xhr.responseText);
                    }
                }
            },

            addRow: function(){
                this.mealArr.push({
                    CategoryID: '',
                    Product: '',
                    ProductList: [],
                    Calories: 0
                });
            },

            remove: function(){
                this.mealArr.pop();
            },
            
            /**
             * Calc P/F/C on amount change
             * @param item
             * @param index
             * @returns {boolean}
             */
            amountChange: function(item, index){
                if (typeof item == "number") item = this.mealArr[item];
                if (!item.Product) return false;


                item.Calories = (parseFloat(item.Product.Protein * 4) + parseFloat(item.Product.Fat * 9)
                        + parseFloat(item.Product.Carbo * 4)) * item.Product.Amount;
                item.aProtein = this.calc(item.Product.Protein, item.Product.Amount);
                item.aFat = this.calc(item.Product.Fat, item.Product.Amount);
                item.aCarbo = this.calc(item.Product.Carbo, item.Product.Amount);
                this.$forceUpdate();

            },

            calc: function(val, amount){
                return parseFloat(val) * amount;
            },
            
            /**
             * Calc Total P/F/C values 
             * @returns {{Calories: number, Protein: number, Fat: number, Carbo: number}}
             */
            total: function(){
                let total = {
                    Calories: 0,
                    Protein: 0,
                    Fat: 0,
                    Carbo: 0
                };

                this.mealArr.forEach((el, i)=>{
                    total.Calories += parseFloat(el.Calories);
                    total.Protein += parseFloat( (el.aProtein || 0));
                    total.Fat += parseFloat( (el.aFat || 0));
                    total.Carbo += parseFloat( (el.aCarbo || 0));
                });
                return total;
            }

        }
    }
  }


});


