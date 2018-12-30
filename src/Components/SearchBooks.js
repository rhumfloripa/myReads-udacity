import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Book from './Book';

class SearchBooks extends React.Component {
    state = {
        value: '',
        searchResults: [],
    };

    searchBooks = () => {
        BooksAPI.search(this.state.value, 20)
            .then(searchResults => {
                const newSearchResults = searchResults.map(result => {
                    const index = this.props.books.find(book => {
                        return book.id === result.id;
                    });

                    if (index !== undefined) {
                        return index;
                    } else {
                        return { ...result, shelf: 'none' };
                    }
                });
                return newSearchResults;
            })
            .then(searchResults => {
                this.setState({
                    searchResults,
                });
            })
            .catch(() => {
                this.setState({
                    searchResults: [],
                });
            });
    };

    handleChange = event => {
        const searchTerm = event.target.value;

        this.setState(
            {
                value: event.target.value,
            },
            () => {
                if (searchTerm !== '') {
                    this.searchBooks();
                } else {
                    this.setState({
                        searchResults: [],
                    });
                }
            },
        );
    };

    render() {
        const booksList =
            this.state.searchResults.length === 0
                ? <li key="no-results">No results</li>
                : this.state.searchResults.map(book => {
                    return (
                        <li key={book.id}>
                            <Book book={book} onShelfUpdate={this.props.onShelfUpdate} />
                        </li>
                    );
                });

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">
                        Close
                    </Link>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.value}
                            placeholder="Search by title or author"
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {booksList}
                    </ol>
                </div>
            </div>
        );
    }
}

export default SearchBooks;
