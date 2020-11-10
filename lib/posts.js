import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(),'posts')
console.log(postsDirectory)

export function getSortedPostsData(){
    // posts配下のファイル名を取得する。
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName =>{
        // idを取得するためにファイル名から.mdを取り除く。
        const id = fileName.replace(/\.md$/, '')
        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        // 投稿のメタデータ部分を解析するために、gray-matterを使う
        const matterResult = matter(fileContents)

        // データとidを照合する
        return{
            id,
            ...matterResult.data
        }
    })
    // 投稿を日付でソートする。
    return allPostsData.sort((a, b) => {
        if(a.date < b.date){
            return 1
        } else {
            return -1
        }
    })

}

//動的ルーティングの実行機能コード
export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory)
      // 以下のような配列を返します:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
    return fileNames.map(fileName =>{
        return{
            params:{
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

//idに基づいて投稿をレンダーするのに必要なデータをフェッチする
export async function getPostData(id){
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    //投稿のメタデータ部分を解析するために、gray-matterを用いる
    const matterResult = matter(fileContents)

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    //データはidと合わせて組み合わせる
    return{
        id,
        contentHtml,
        ...matterResult.data
    }

}