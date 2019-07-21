class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      form: {
        title: '',
        description: '',
        url: '',
        tags: ''
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    this.getCurrentListings();
  }

  getCurrentListings() {
    var currentListings = [];
    fetch('api/listings')
    .then(res => res.json())
    .then(data => 
      {
        currentListings = data.data;
        this.setState({
          listings: currentListings
        })
      })
      .catch(err=> {
        console.log(err)
      });

      console.log(this.state.listings)
  }

  saveNewListing() {
    var postData = {data: this.state.form}
    fetch('api/listings', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(postData)
     })
       .then(res => res.json())
       .then(data => {
        currentListings = data;
        this.setState({
          listings: currentListings
        })
       })
       .catch(err => {console.log(err)});
   }
  

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      form: {
      ...this.state.form,
      [name]: value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let newListing = {title: this.state.form.title, description: this.state.form.description, url: this.state.form.url, tags: this.state.form.tags};
    const listings = [...this.state.listings, newListing]
    this.setState({
      listings,
      form: {
        title: '',
        description: '',
        url: '',
        tags: ''
      }
    });
    this.saveNewListing();
  }

  render() {
    return (
      <main>
        <nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
    <a class="navbar-brand" href="#">CoCoDev</a>
    </div>
  </div>
</nav>
      <form class="form-group">
        <label>
          Title: 
          <input
            name="title"
            type="text"
            class="form-control"
            value={this.state.form.title}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Description: 
          <textarea
            name="description"
            type="longtext"
            class="form-control"
            value={this.state.form.description}
            onChange={this.handleInputChange} ></textarea>
        </label>
        <br />
        <label>
          URL: 
          <input
            name="url"
            type="text"
            class="form-control"
            value={this.state.form.url}
            onChange={this.handleInputChange} />
        </label>
        <br/>
        <label>
          Tags: 
          <input
            name="tags"
            type="text"
            class="form-control"
            value={this.state.form.tags}
            onChange={this.handleInputChange} />
        </label>
        <br/>
        <button class="btn" onClick={this.handleSubmit} >Submit</button>
      </form>
      <div>
          {this.state.listings.map(listing => (
            <div class="panel panel-default">
            <div class="panel-heading" ><a href={listing.url}>{listing.title}</a>
            <div class="text-muted small">{listing.timestamp?listing.timestamp:'new'}</div></div>
            <div class="panel-body">{listing.description}
            </div>
            <div>
            {listing.tags?listing.tags.split(',').map(tag => (<span class="badge">{tag}</span>)):null}
            </div>
            </div>
          ))}
          </div>
        </main>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));