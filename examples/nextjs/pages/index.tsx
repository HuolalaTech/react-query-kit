import React, { useState } from 'react'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { usePosts } from '../services/posts'

const Home = () => {
  const [postCount, setPostCount] = useState(10)
  const { data, isFetching } = usePosts(postCount)

  return (
    <main>
      <div className="info">
        <style jsx>{`
          .info {
            margin-top: 20px;
            margin-bottom: 20px;
            padding-top: 20px;
            padding-bottom: 20px;
            border-top: 1px solid #ececec;
            border-bottom: 1px solid #ececec;
          }
        `}</style>
        ℹ️ This page shows how to use SSG with React-Query.
      </div>

      <section>
        <ul>
          {data?.map((post, index) => (
            <li key={post.id}>
              <div>
                <span>{index + 1}. </span>
                <a href="#">{post.title}</a>
              </div>
            </li>
          ))}
        </ul>
        {postCount <= 90 && (
          <button
            onClick={() => setPostCount(postCount + 10)}
            disabled={isFetching}
          >
            {isFetching ? 'Loading...' : 'Show More'}
          </button>
        )}
        <style jsx>{`
          section {
            padding-bottom: 20px;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          button:before {
            align-self: center;
            border-style: solid;
            border-width: 6px 4px 0 4px;
            border-color: #ffffff transparent transparent transparent;
            content: '';
            height: 0;
            margin-right: 5px;
            width: 0;
          }
        `}</style>
      </section>
      <style jsx global>{`
        * {
          font-family: Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
            'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New',
            monospace, serif;
        }
        body {
          margin: 0;
          padding: 25px 50px;
        }
        a {
          color: #22bad9;
        }
        p {
          font-size: 14px;
          line-height: 24px;
        }
        article {
          margin: 0 auto;
          max-width: 650px;
        }
        button {
          align-items: center;
          background-color: #22bad9;
          border: 0;
          color: white;
          display: flex;
          padding: 5px 7px;
          transition: background-color 0.3s;
        }
        button:active {
          background-color: #1b9db7;
        }
        button:disabled {
          background-color: #b5bebf;
        }
        button:focus {
          outline: none;
        }
      `}</style>
    </main>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(
    usePosts.getKey({ limit: 10 }),
    usePosts.queryFn
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Home
