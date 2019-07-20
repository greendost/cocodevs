

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      title: '',
      description: '',
      url: '',
      tags: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let newListing = {title: this.state.title, url: this.state.url, tags: this.state.tags};
    const listings = [...this.state.listings, newListing]
    this.setState({
      listings,
      title: '',
      description: '',
      url: '',
      tags: ''
    });
    
  }

  render() {
    return (
      <main>
      <form>
        <label>
          Title: 
          <input
            name="title"
            type="text"
            value={this.state.title}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Description: 
          <textarea
            name="description"
            type="longtext"
            value={this.state.description}
            onChange={this.handleInputChange} ></textarea>
        </label>
        <br />
        <label>
          URL: 
          <input
            name="url"
            type="text"
            value={this.state.url}
            onChange={this.handleInputChange} />
        </label>
        <br/>
        <label>
          Tags: 
          <input
            name="tags"
            type="text"
            value={this.state.tags}
            onChange={this.handleInputChange} />
        </label>
        <br/>
        <button onClick={this.handleSubmit} >Submit</button>
      </form>
      
          {this.state.listings.map(listing => (
            <div>
            <div><a href={listing.url}>{listing.title}</a></div>
            <div>{listing.description}</div>
            <div>{listing.tags}</div>
            </div>
          )
          )}
        </main>
    );
  }
}



ReactDOM.render(<App />, document.querySelector('#root'));
