import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView

fun RecyclerView.addPaginationListener(
    isLoading: Boolean,
    loadPreviousPage: () -> Unit,
    loadNextPage: () -> Unit
) {
    this.addOnScrollListener(object : RecyclerView.OnScrollListener() {
        override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
            super.onScrolled(recyclerView, dx, dy)
            val layoutManager = recyclerView.layoutManager as? GridLayoutManager

            // Загрузка предыдущей страницы при достижении верха списка
            val firstVisibleItemPosition = layoutManager?.findFirstVisibleItemPosition() ?: 0
            if (!isLoading && firstVisibleItemPosition == 0 && dy < 0) {
                loadPreviousPage()
            }

            // Загрузка следующей страницы при достижении конца списка
            val lastVisibleItemPosition = layoutManager?.findLastVisibleItemPosition() ?: 0
            val totalItemCount = layoutManager?.itemCount ?: 0
            if (!isLoading && lastVisibleItemPosition == totalItemCount - 1) {
                loadNextPage()
            }
        }
    })
}

