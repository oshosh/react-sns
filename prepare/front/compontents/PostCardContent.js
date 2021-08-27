// import React from 'react';
// import PropTypes from 'prop-types'
// import Link from 'next/link';

// // https://regexr.com/
// // 첫 번째 게시글 #해시태그 #익스프레스
// // #첫번째#두번째
// // ###제로초
// function PostCardContent({ postData }) {
//     return (
//         <div>
//             {postData.split(/(#[^\s#]+)/g).map((v, idx) => {
//                 if (v.match(/(#[^\s]+)/)) {
//                     return (
//                         <Link
//                             key={idx}
//                             href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
//                             as={`/hashtag/${v.slice(1)}`}
//                             key={v}
//                         >
//                             <a>{v}</a>
//                         </Link>
//                     );
//                 }
//                 return v;
//             })}
//         </div>
//     );
// }

// PostCardContent.prototype = { postData: PropTypes.string.isRequired }

// export default PostCardContent;

import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => ( // 첫 번째 게시글 #해시태그 #해시태그
    <div>
        {postData.split(/(#[^\s#]+)/g).map((v, i) => {
            if (v.match(/(#[^\s#]+)/)) {
                return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
            }
            return v;
        })}
    </div>
);

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent;