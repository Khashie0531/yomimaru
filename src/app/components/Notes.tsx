import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Save, X, Sparkles } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  created_at: string;
}

const colors = [
  { name: 'yellow', bg: 'from-yellow-100 to-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
  { name: 'pink', bg: 'from-pink-100 to-pink-50', border: 'border-pink-200', text: 'text-pink-900' },
  { name: 'blue', bg: 'from-blue-100 to-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
  { name: 'green', bg: 'from-green-100 to-green-50', border: 'border-green-200', text: 'text-green-900' },
  { name: 'purple', bg: 'from-purple-100 to-purple-50', border: 'border-purple-200', text: 'text-purple-900' },
  { name: 'orange', bg: 'from-orange-100 to-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
];

export function Notes() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // ローカルストレージに保存
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const handleAddNote = () => {
    if (!title.trim()) return;

    if (editingId) {
      // 編集モード
      const updated = notes.map(note =>
        note.id === editingId
          ? { ...note, title, content, color: selectedColor }
          : note
      );
      saveNotes(updated);
      setEditingId(null);
    } else {
      // 新規追加モード
      const newNote: Note = {
        id: Date.now(),
        title,
        content,
        color: selectedColor,
        created_at: new Date().toISOString(),
      };
      saveNotes([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
    setSelectedColor(colors[0].name);
    setIsFormOpen(false);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('このノートを削除しますか?')) {
      saveNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setSelectedColor(colors[0].name);
    setIsFormOpen(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClasses = (colorName: string) => {
    return colors.find(c => c.name === colorName) || colors[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="size-8 text-blue-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('notes.title')}
            </h2>
          </div>
          <p className="text-gray-600 text-lg">{notes.length} 件のメモ</p>
        </div>

        {/* 検索バー */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="メモを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-xl bg-white shadow-md border-2 border-transparent hover:border-blue-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>

        {/* 新規作成ボタン */}
        {!isFormOpen && (
          <div className="mb-8">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group"
            >
              <Plus className="size-6 group-hover:rotate-90 transition-transform" />
              新しいメモを作成
            </button>
          </div>
        )}

        {/* 入力フォーム */}
        {isFormOpen && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingId ? '✏️ メモを編集' : '📝 新しいメモを作成'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="size-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* タイトル入力 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    タイトル
                  </label>
                  <input
                    type="text"
                    placeholder="メモのタイトルを入力..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-lg font-semibold"
                  />
                </div>

                {/* 内容入力 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    内容
                  </label>
                  <textarea
                    placeholder="メモの内容を入力..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg h-40 resize-none focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* 色選択 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    色を選択
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-12 h-12 rounded-lg transition-all transform hover:scale-110 ${
                          selectedColor === color.name
                            ? `bg-gradient-to-br ${color.bg} ring-2 ring-blue-500 scale-110 shadow-lg`
                            : `bg-gradient-to-br ${color.bg} hover:shadow-md opacity-70`
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-semibold"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!title.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 font-semibold"
                  >
                    <Save className="size-5" />
                    {editingId ? '更新' : '保存'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* メモ一覧 */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => {
              const colorClass = getColorClasses(note.color);
              return (
                <div
                  key={note.id}
                  className={`group relative bg-gradient-to-br ${colorClass.bg} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 ${colorClass.border} p-6 flex flex-col h-80 animate-in fade-in slide-in-from-bottom-4`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* グラデーション背景 */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition pointer-events-none from-white to-transparent" />

                  {/* コンテンツ */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h4 className={`font-bold text-xl mb-3 line-clamp-2 ${colorClass.text}`}>
                      {note.title}
                    </h4>
                    <p className={`text-sm line-clamp-6 flex-1 ${colorClass.text} opacity-80 leading-relaxed`}>
                      {note.content}
                    </p>
                  </div>

                  {/* 日付 */}
                  <div className={`text-xs ${colorClass.text} opacity-60 mt-4 pt-3 border-t-2 border-current border-opacity-20`}>
                    {new Date(note.created_at).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  {/* アクションボタン */}
                  <div className="relative z-10 flex gap-2 justify-end pt-4 mt-4 border-t-2 border-current border-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(note)}
                      className={`p-2 rounded-lg bg-white hover:bg-blue-50 transition shadow-md hover:shadow-lg ${colorClass.text}`}
                      title="編集"
                    >
                      <Edit2 className="size-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 rounded-lg bg-white hover:bg-red-50 transition text-red-600 shadow-md hover:shadow-lg"
                      title="削除"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-2xl font-bold text-gray-700 mb-2">
              {searchQuery ? '該当するメモがありません' : 'メモがありません'}
            </p>
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? '別のキーワードで検索してみてください'
                : '「新しいメモを作成」ボタンからメモを追加してください'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
