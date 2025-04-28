import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const tools = [
    {
      id: 'json-formatter',
      title: 'JSON Formatter & Visual Editor',
      description: 'Simple JSON editor'
    },
    {
      id: 'encoder-decoder',
      title: 'Encoder/Decoder Utility',
      description: 'Hash text to b-crypt, quickly create hashed password'
    },
    {
      id: 'regex-validator',
      title: 'Regex Validator & Generator',
      description: 'Test, and validate regular expressions with enhanced functionality.'
    },
    {
      id: 'salt-encode-decode',
      title: 'Salt Encode/Decode Tool',
      description: 'Check the salted encoding and decoding of text.'
    },
    {
      id: 'half-width-full-width',
      title: 'Half-Width/Full-Width Converter',
      description: 'Seamlessly convert characters between half-width and full-width formats—perfect for multilingual and localization scenarios.'
    },
    {
      id: 'text-diff-checker',
      title: 'Text Diff Checker',
      description: 'Compare two text blocks line by line or word by word, with visual highlights to quickly spot differences.'
    },
    {
      id: 'secure-password-generator',
      title: 'Secure Password Generator',
      description: 'Create strong, customizable passwords with options for length, complexity, and character types.'
    },
    {
      id: 'sql-formatter',
      title: 'SQL Query Validator & Formatter',
      description: 'Format, minify, and validate your SQL queries with ease.'
    },
    {
      id: 'json-structure-builder',
      title: '承認フロー作成',
      description: 'UIで承認フロー作成'
    }
  ];

  return (
    <div className="home-container">
      <h1>Welcome to DevSupport Toolbox</h1>
      <p className="home-intro">Your all-in-one developer utility suite. Select a tool to get started:</p>
      <div className="tools-grid">
        {tools.map((tool) => (
          <Link to={`/${tool.id}`} key={tool.id} className="tool-card">
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;