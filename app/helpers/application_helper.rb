module ApplicationHelper
  include Pagy::Frontend

  def link_helper link
    @link = link.strip
    if @link[0..3] == "http" or @link[0..4] == "https"
        @link
    else
        "//#{@link}"
    end
  end

  def markdown(content)
    renderer =
      Redcarpet::Render::HTML.new(
        hard_wrap: true,
        autolink: true,
        no_intra_empasis: true,
        disable_indented_code_blocks: true,
        fenced_code_blocks: true,
        strikethough: true,
        superscirpt: true
      )

    Redcarpet::Markdown.new(renderer).render(content).html_safe
  end
end
