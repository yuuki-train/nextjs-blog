import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(),'posts')
console.log(postsDirectory)

export function getSortedPostsData(){
    // posts配下のファイル名を取得する。
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName =>{
        // idを取得するためにファイル名から.mdを取り除く。
        const id = fileName.replace(/\.md$/, '')
        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory)
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