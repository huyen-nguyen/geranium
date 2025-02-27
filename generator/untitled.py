import os

def count_items_in_folder(path, item_type='both'):
    total_count = 0
    
    for root, dirs, files in os.walk(path):
        if item_type == 'files':
            total_count += len(files)
        elif item_type == 'dirs':
            total_count += len(dirs)
        elif item_type == 'both':
            total_count += len(files) + len(dirs)
        break  # Assuming you want to check only the first level depth
    
    return total_count

# Example usage
folder_path = 'generated_combine'
print("Total items:", count_items_in_folder(folder_path))
print("Total files:", count_items_in_folder(folder_path, item_type='files'))
print("Total directories:", count_items_in_folder(folder_path, item_type='dirs'))