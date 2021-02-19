import withRepoBasic from '../../components/with-repo-basic'
import dynamic from 'next/dynamic'

import api from '../../lib/api'
import 'github-markdown-css'

const MDRender = dynamic(() => import('../../components/MarkdowmRenderer'),
  {
    loading: () => <p>loading</p>
  })

function Detail({ readme }) {
  return <MDRender content={readme.content} isBase64={true}/>
}

Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res,
  },
}) => {
  const readmeResp = await api.request({
      url: `/repos/${owner}/${name}/readme`,
    },
    req,
    res
  )
  console.log(readmeResp.data)

  return {
    readme: readmeResp.data,
  }
}
export default withRepoBasic(Detail, 'index')
